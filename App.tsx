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
import DigitButton from './DigitButton';

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
          <TouchableOpacity style={[styles.button,styles.buttonSpanTwo]}><Text>AC</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>DEL</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>/</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>2</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>x</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>4</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>5</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>6</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>+</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>7</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>8</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>9</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>-</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.buttonSpanTwo]}><Text>0</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>.</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text>=</Text></TouchableOpacity>
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
  }
});

export default App;
