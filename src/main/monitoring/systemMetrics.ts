import os from 'os';
import process from 'process';

export interface MemoryInfo {
  used: number;        // Used memory in MB
  total: number;       // Total memory in MB
  free: number;        // Free memory in MB
  percentage: number;  // Usage percentage
  appUsed: number;     // Application memory usage in MB
}

export interface MemoryStatus {
  used: 'normal' | 'warning' | 'critical';
}

/**
 * Get application memory usage (RSS)
 */
export function getMemoryUsage(): number {
  const memoryUsage = process.memoryUsage();
  // RSS (Resident Set Size) in MB
  return Math.round(memoryUsage.rss / 1024 / 1024);
}

/**
 * Get system memory information
 */
export function getSystemMemory(): { total: number; free: number; used: number } {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  return {
    total: Math.round(totalMem / 1024 / 1024),      // MB
    free: Math.round(freeMem / 1024 / 1024),        // MB
    used: Math.round((totalMem - freeMem) / 1024 / 1024), // MB
  };
}

/**
 * Calculate memory usage percentage
 */
export function calculateMemoryPercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

/**
 * Get complete memory information
 */
export function getMemoryInfo(): MemoryInfo {
  const systemMemory = getSystemMemory();
  const appMemory = getMemoryUsage();
  const percentage = calculateMemoryPercentage(systemMemory.used, systemMemory.total);

  return {
    used: systemMemory.used,
    total: systemMemory.total,
    free: systemMemory.free,
    percentage,
    appUsed: appMemory,
  };
}

/**
 * Get memory status based on usage percentage
 */
export function getMemoryStatus(percentage: number): MemoryStatus['used'] {
  if (percentage >= 90) {
    return 'critical';
  } else if (percentage >= 80) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Get CPU usage (simplified - returns average load)
 */
export function getCPULoad(): number {
  const loads = os.loadavg();
  // Return 1-minute load average
  return Math.round(loads[0] * 100) / 100;
}

/**
 * Get CPU cores count
 */
export function getCPUCores(): number {
  return os.cpus().length;
}
