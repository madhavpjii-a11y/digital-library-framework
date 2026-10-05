export const books = [
  { id: 'B001', title: 'Data Structures & Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', totalCopies: 20, issuedCopies: 15, available: true },
  { id: 'B002', title: 'Computer Organization', author: 'Carl Hamacher', category: 'Computer Architecture', totalCopies: 15, issuedCopies: 15, available: false },
  { id: 'B003', title: 'Operating Systems', author: 'Abraham Silberschatz', category: 'Computer Science', totalCopies: 12, issuedCopies: 8, available: true },
  { id: 'B004', title: 'Digital Logic Design', author: 'M. Morris Mano', category: 'Digital Systems', totalCopies: 18, issuedCopies: 10, available: true },
  { id: 'B005', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', totalCopies: 10, issuedCopies: 10, available: false },
  { id: 'B006', title: 'Database Systems', author: 'Ramez Elmasri', category: 'Database', totalCopies: 14, issuedCopies: 6, available: true },
  { id: 'B007', title: 'Compiler Design', author: 'Alfred V. Aho', category: 'Computer Science', totalCopies: 8, issuedCopies: 3, available: true },
  { id: 'B008', title: 'Microprocessor Architecture', author: 'Ramesh Gaonkar', category: 'Computer Architecture', totalCopies: 16, issuedCopies: 12, available: true },
];

export const members = [
  { id: 'M001', name: 'Arjun Sharma', department: 'Computer Science', semester: 5 },
  { id: 'M002', name: 'Priya Patel', department: 'Information Technology', semester: 3 },
  { id: 'M003', name: 'Rahul Verma', department: 'Computer Science', semester: 7 },
  { id: 'M004', name: 'Sneha Gupta', department: 'Electronics', semester: 5 },
  { id: 'M005', name: 'Vikram Singh', department: 'Computer Science', semester: 3 },
  { id: 'M006', name: 'Ananya Reddy', department: 'Information Technology', semester: 7 },
];

export const transactions = [
  { id: 'T001', bookId: 'B001', memberId: 'M001', issueDate: '2024-01-15', returnDate: '2024-02-15', status: 'Returned' },
  { id: 'T002', bookId: 'B003', memberId: 'M002', issueDate: '2024-02-01', returnDate: '2024-03-01', status: 'Active' },
  { id: 'T003', bookId: 'B004', memberId: 'M003', issueDate: '2024-01-20', returnDate: '2024-02-20', status: 'Returned' },
  { id: 'T004', bookId: 'B001', memberId: 'M004', issueDate: '2024-02-10', returnDate: '2024-03-10', status: 'Active' },
  { id: 'T005', bookId: 'B006', memberId: 'M005', issueDate: '2024-02-15', returnDate: '2024-03-15', status: 'Overdue' },
  { id: 'T006', bookId: 'B008', memberId: 'M001', issueDate: '2024-03-01', returnDate: '2024-04-01', status: 'Active' },
];

export const processingExamples = [
  {
    id: 1,
    title: 'Book Availability Check',
    description: 'Calculate available copies from total and issued counts',
    operandA: 20,
    operandB: 15,
    operation: 'SUB',
    operandALabel: 'Total Books',
    operandBLabel: 'Issued Books',
    resultLabel: 'Available Books',
    expectedResult: 5,
  },
  {
    id: 2,
    title: 'Record Count Update',
    description: 'Add new records to existing library database',
    operandA: 150,
    operandB: 25,
    operation: 'ADD',
    operandALabel: 'Existing Records',
    operandBLabel: 'New Records',
    resultLabel: 'Total Records',
    expectedResult: 175,
  },
  {
    id: 3,
    title: 'Availability Status',
    description: 'Check if copies are available (comparison)',
    operandA: 5,
    operandB: 0,
    operation: 'CMP',
    operandALabel: 'Available Copies',
    operandBLabel: 'Zero Threshold',
    resultLabel: 'Status',
    expectedResult: 'AVAILABLE',
  },
];

export const pipelineStages = [
  { id: 'library', label: 'Digital Library', icon: 'Database', color: '#8b5cf6', description: 'Source of structured digital information including books, members, and transaction records.' },
  { id: 'memory', label: 'Memory', icon: 'HardDrive', color: '#3b82f6', description: 'Stores data at addressable locations for retrieval by the processor.' },
  { id: 'bus', label: 'Bus', icon: 'ArrowLeftRight', color: '#06b6d4', description: 'Communication pathway transferring data between memory, registers, and processor.' },
  { id: 'registers', label: 'Registers', icon: 'Layers', color: '#10b981', description: 'High-speed temporary storage inside the processor for immediate data access.' },
  { id: 'processor', label: 'Processor', icon: 'Cpu', color: '#f59e0b', description: 'Central processing unit that coordinates and executes instructions on data.' },
  { id: 'alu', label: 'ALU', icon: 'Calculator', color: '#ef4444', description: 'Arithmetic Logic Unit performs mathematical and logical operations on data.' },
  { id: 'result', label: 'Result', icon: 'CheckCircle', color: '#10b981', description: 'Final processed output — the meaningful information derived from raw data.' },
];

export const architectureDetails = {
  library: {
    title: 'Digital Library Data',
    what: 'The digital library stores structured information such as book records, member details, and transaction logs.',
    why: 'Provides the raw data input that needs to be processed by the computer system.',
    dataTypes: 'Text strings, numeric IDs, dates, boolean flags, integers',
    role: 'Acts as the primary data source — the starting point of the processing pipeline.',
  },
  memory: {
    title: 'Memory / Storage',
    what: 'Memory stores data at specific addressable locations (addresses). Each location holds a fixed-size unit of data.',
    why: 'The processor cannot work directly with external data; information must first be loaded into memory for access.',
    dataTypes: 'Binary-encoded values mapped to memory addresses (e.g., 0x0001 → Book ID)',
    role: "Serves as the bridge between external data sources and the processor's internal components.",
  },
  bus: {
    title: 'Bus / Data Transfer',
    what: 'The bus is a communication pathway consisting of Address Bus, Data Bus, and Control Bus.',
    why: 'Components need a standardized way to exchange information. The bus provides this shared communication channel.',
    dataTypes: 'Address signals, data packets, control signals (read/write/interrupt)',
    role: 'Connects memory, registers, processor, and I/O devices — enabling coordinated data transfer.',
  },
  registers: {
    title: 'Registers',
    what: 'Registers are small, ultra-fast storage locations inside the processor (R0–R3, PC, IR, SP).',
    why: 'Memory access is slow compared to processor speed. Registers provide immediate data access during computation.',
    dataTypes: 'Single data values, instruction codes, memory addresses, stack pointers',
    role: 'Hold operands, intermediate results, and control information needed during instruction execution.',
  },
  processor: {
    title: 'Processor (CPU)',
    what: 'The Central Processing Unit fetches, decodes, and executes instructions using its internal components.',
    why: 'All computation and decision-making happens here — it is the "brain" of the computer system.',
    dataTypes: 'Instructions (opcodes + operands), control signals, status flags',
    role: 'Orchestrates the entire processing pipeline — from fetching data to producing results.',
  },
  alu: {
    title: 'Arithmetic Logic Unit (ALU)',
    what: 'The ALU performs arithmetic operations (add, subtract, multiply, divide) and logical operations (AND, OR, XOR, NOT).',
    why: 'All meaningful computation ultimately reduces to arithmetic and logic — the ALU is where data becomes information.',
    dataTypes: 'Binary operands, operation codes, result values, status flags (carry, zero, overflow)',
    role: 'The computational core of the processor — transforms input data into meaningful results.',
  },
  result: {
    title: 'Information Result',
    what: 'The final output of the processing pipeline — meaningful information derived from raw library data.',
    why: 'The entire purpose of the pipeline is to transform raw data into useful, actionable information.',
    dataTypes: 'Computed values, boolean statuses, processed records',
    role: 'Represents the end goal — answering queries like "How many books are available?" or "Is this book in stock?"',
  },
};

export const addressingModes = [
  {
    name: 'Immediate',
    description: 'Operand is directly specified in the instruction itself.',
    example: { instruction: 'MOV R0, #25', address: '—', data: '25', result: 'R0 = 25' },
    diagram: 'Instruction → [#25] → R0',
  },
  {
    name: 'Direct',
    description: 'Instruction contains the memory address of the operand.',
    example: { instruction: 'LOAD R0, [0x0001]', address: '0x0001', data: 'B001', result: 'R0 = B001' },
    diagram: 'Instruction → [Addr: 0x0001] → Memory → R0',
  },
  {
    name: 'Indirect',
    description: 'Instruction contains the address of a location that holds the actual address.',
    example: { instruction: 'LOAD R0, [[0x0010]]', address: '0x0010 → 0x0001', data: 'B001', result: 'R0 = B001' },
    diagram: 'Instruction → [Ptr: 0x0010] → [Addr: 0x0001] → Memory → R0',
  },
  {
    name: 'Register',
    description: 'Operand is stored in a register, not in memory.',
    example: { instruction: 'ADD R2, R0, R1', address: '—', data: 'R0 + R1', result: 'R2 = R0 + R1' },
    diagram: 'Instruction → [R0, R1] → ALU → R2',
  },
];

export const conceptTopics = [
  {
    id: 'computer-org',
    title: 'Computer Organization',
    description: 'How major hardware components (CPU, memory, I/O, bus) interconnect and cooperate to execute programs.',
    icon: 'Monitor',
  },
  {
    id: 'functional-units',
    title: 'Functional Units',
    description: 'Memory, Processor, ALU, Registers, and Buses — the building blocks of any computer system.',
    icon: 'Boxes',
  },
  {
    id: 'bus-arch',
    title: 'Bus Architecture',
    description: 'Shared communication pathways (Address, Data, Control) connecting system components.',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'bus-arb',
    title: 'Bus Arbitration',
    description: 'Controlled access to a shared bus when multiple components compete for communication.',
    icon: 'Shield',
  },
  {
    id: 'registers',
    title: 'Registers',
    description: 'High-speed temporary storage inside the processor for data and control information.',
    icon: 'Layers',
  },
  {
    id: 'memory-transfer',
    title: 'Memory Transfer',
    description: 'Movement of data between memory locations and processor registers via the bus.',
    icon: 'ArrowDownUp',
  },
  {
    id: 'processor-org',
    title: 'Processor Organization',
    description: 'Internal structure of the CPU: control unit, datapath, ALU, and register file.',
    icon: 'Cpu',
  },
];

export const unit2Topics = [
  { id: 'alu-design', title: 'ALU Design', description: 'Architecture and implementation of the Arithmetic Logic Unit.', icon: 'Calculator' },
  { id: 'signed-mult', title: 'Signed Multiplication', description: 'Handling sign extension and two\'s complement in multiplication.', icon: 'X' },
  { id: 'booths', title: "Booth's Algorithm", description: 'Efficient signed binary multiplication using bit-pair recoding.', icon: 'Binary' },
  { id: 'array-mult', title: 'Array Multiplier', description: 'Hardware multiplication using a grid of partial products.', icon: 'Grid3x3' },
  { id: 'division', title: 'Division Algorithm', description: 'Restoring and non-restoring division of binary numbers.', icon: 'Divide' },
  { id: 'logic-ops', title: 'Logic Operations', description: 'Bitwise AND, OR, XOR, NOT operations on binary data.', icon: 'ToggleLeft' },
  { id: 'floating-point', title: 'Floating-Point Arithmetic', description: 'IEEE 754 representation of real numbers in binary.', icon: 'Hash' },
];
