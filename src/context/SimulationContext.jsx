import { createContext, useContext, useReducer } from 'react';

const SimulationContext = createContext(null);

const initialState = {
  systemStatus: {
    memory: 'READY',
    bus: 'IDLE',
    registers: 'READY',
    processor: 'READY',
    alu: 'READY',
    system: 'READY',
  },
  memory: Array.from({ length: 10 }, (_, i) => ({
    address: `0x${String(i + 1).padStart(4, '0')}`,
    data: null,
    label: '',
    active: false,
  })),
  registers: {
    R0: 0, R1: 0, R2: 0, R3: 0,
    PC: 0, IR: 0, SP: 1023,
  },
  stack: [],
  busState: 'IDLE',
  busRequests: [],
  busGrantedTo: null,
  pipelineStep: -1,
  pipelineRunning: false,
  eventLog: [],
  currentExample: null,
};

function simulationReducer(state, action) {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, systemStatus: { ...state.systemStatus, ...action.payload } };

    case 'LOAD_MEMORY': {
      const newMemory = [...state.memory];
      const { index, data, label } = action.payload;
      newMemory[index] = { ...newMemory[index], data, label, active: true };
      return { ...state, memory: newMemory };
    }

    case 'CLEAR_MEMORY_HIGHLIGHT': {
      const mem = state.memory.map(m => ({ ...m, active: false }));
      return { ...state, memory: mem };
    }

    case 'RESET_MEMORY':
      return { ...state, memory: initialState.memory.map(m => ({ ...m })) };

    case 'SET_REGISTER':
      return { ...state, registers: { ...state.registers, [action.payload.name]: action.payload.value } };

    case 'RESET_REGISTERS':
      return { ...state, registers: { ...initialState.registers } };

    case 'PUSH_STACK':
      return { ...state, stack: [...state.stack, action.payload] };

    case 'POP_STACK':
      return { ...state, stack: state.stack.slice(0, -1) };

    case 'CLEAR_STACK':
      return { ...state, stack: [] };

    case 'SET_BUS_STATE':
      return { ...state, busState: action.payload };

    case 'REQUEST_BUS':
      return { ...state, busRequests: [...state.busRequests, action.payload] };

    case 'GRANT_BUS':
      return {
        ...state,
        busGrantedTo: action.payload,
        busRequests: state.busRequests.filter(r => r !== action.payload),
        busState: 'GRANTED',
      };

    case 'RELEASE_BUS':
      return { ...state, busGrantedTo: null, busState: 'IDLE', busRequests: [] };

    case 'SET_PIPELINE_STEP':
      return { ...state, pipelineStep: action.payload };

    case 'SET_PIPELINE_RUNNING':
      return { ...state, pipelineRunning: action.payload };

    case 'ADD_LOG':
      return { ...state, eventLog: [...state.eventLog, { time: new Date().toLocaleTimeString(), message: action.payload }] };

    case 'CLEAR_LOG':
      return { ...state, eventLog: [] };

    case 'SET_EXAMPLE':
      return { ...state, currentExample: action.payload };

    case 'RESET_ALL':
      return { ...initialState, memory: initialState.memory.map(m => ({ ...m })) };

    default:
      return state;
  }
}

export function SimulationProvider({ children }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
}
