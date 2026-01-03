// Export all entities
export * from './entities/UserProfile';
export * from './entities/Job';
export * from './entities/Tool';
export * from './entities/ToolBooking';
export * from './entities/Review';
export * from './entities/Transaction';
export * from './entities/Message';
export * from './entities/Notification';

// Legacy Booking interface for backward compatibility with existing components
// until they are fully migrated to ToolBooking or JobBooking specific types.
export interface Booking {
  id: string;
  itemId: string; // Tool ID or Job ID
  type: 'TOOL' | 'JOB';
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  amount: number;
}