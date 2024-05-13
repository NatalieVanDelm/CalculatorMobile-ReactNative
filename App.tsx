import React from 'react';
import { useReducer } from 'react';
import type {PropsWithChildren, ReducerAction} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: `${payload.digit}`,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
        ...state,
        operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
        ...state,
        previousOperand: state.currentOperand,
        currentOperand: null,
        operation: payload.operation,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      // could also only delete one digit of currentOperand
      return {
        ...state,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ''
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev/current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function DigitButton({dispatch, digit, style}): React.JSX.Element {
  return (
    <TouchableOpacity style={style} onPress={() => {dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit}})}}><Text style={styles.text}>{digit}</Text></TouchableOpacity>
  )
}

function OperationButton({dispatch, operation}): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.button} onPress={() => {dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})}}><Text style={styles.text}>{operation}</Text></TouchableOpacity>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={[styles.calculatorGrid]}>
        <View style={[styles.output,]}>
          <Text style={[styles.previousOperand,]}>{formatOperand(previousOperand)} {operation}</Text>
          <Text style={[styles.currentOperand,]}>{formatOperand(currentOperand)}</Text>
        </View>
        <View style={[styles.buttons]}>
          <TouchableOpacity style={[styles.button,styles.buttonSpanTwo]} onPress={() => {dispatch({type: ACTIONS.CLEAR, payload: null})}}><Text style={styles.text}>AC</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {dispatch({type: ACTIONS.DELETE_DIGIT, payload: null})}}><Text style={styles.text}>DEL</Text></TouchableOpacity>
          <OperationButton operation='÷' dispatch={dispatch}/>
          <DigitButton style={styles.button} digit='1' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='2' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='3' dispatch={dispatch} />
          <OperationButton operation='x' dispatch={dispatch}/>
          <DigitButton style={styles.button} digit='4' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='5' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='6' dispatch={dispatch} />
          <OperationButton operation='+' dispatch={dispatch}/>
          <DigitButton style={styles.button} digit='7' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='8' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='9' dispatch={dispatch} />
          <OperationButton operation='-' dispatch={dispatch}/>
          <DigitButton style={[styles.button, styles.buttonSpanTwo]} digit='0' dispatch={dispatch} />
          <DigitButton style={styles.button} digit='.' dispatch={dispatch} />
          <TouchableOpacity style={styles.button} onPress={() => {dispatch({type: ACTIONS.EVALUATE, payload: null})}}><Text>=</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calculatorGrid: {
    flex: 1
  },
  output: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.75)',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    padding: 8
  },
  previousOperand: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 40
  },
  currentOperand: {
      color: 'rgba(255,255,255,1)',
      fontSize: 60
  },
  buttons: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255, 0.9)'
  },
  button: {
    width: '25%',
    height: '20%',
    alignItems: 'center',
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255,255,255, 0.75)'
  },
  buttonSpanTwo: {
    width: '50%'
  },
  text: {
    alignSelf: 'center',
    fontSize: 40
  }
});

export default App;
