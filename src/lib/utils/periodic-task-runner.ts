export class PeriodicTaskRunner {
  private intervalMs: number;
  private task: () => void | Promise<void>;
  private timerId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(task: () => void | Promise<void>, intervalMs: number) {
    this.task = task;
    if (intervalMs <= 0) {
      throw new Error("Interval must be positive.");
    }
    this.intervalMs = intervalMs;
  }

  start(useSetInterval: boolean = false): void {
    // Default to false
    if (this.isRunning) {
      console.warn("Task runner is already running.");
      return;
    }
    this.isRunning = true;

    if (useSetInterval) {
      this.timerId = setInterval(async () => {
        // Add isRunning check inside setInterval too, in case stop was called
        if (!this.isRunning) {
          clearInterval(this.timerId!); // Use ! because it must be set if we are here
          this.timerId = null;
          return;
        }
        await this.executeTaskInternal(); // Use internal helper
      }, this.intervalMs);
    } else {
      // Start the recursive setTimeout chain
      this.scheduleNext();
    }
  }

  private scheduleNext(): void {
    // If stop() was called, isRunning will be false, prevent scheduling.
    if (!this.isRunning) {
      return;
    }

    // --- Core setTimeout Logic ---
    // Clear any potentially lingering timer explicitly (though stop should handle it)
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(async () => {
      // Check if stop() was called *while waiting* for the timeout
      if (!this.isRunning) {
        this.timerId = null; // Ensure ID is cleared if stopped during wait
        return;
      }

      // Execute the task
      await this.executeTaskInternal();

      // Task finished, schedule the next run *only if* still marked as running
      // This ensures the interval starts *after* the previous task completes.
      if (this.isRunning) {
        this.scheduleNext();
      } else {
        // Ensure ID is cleared if stop() called during task execution
        this.timerId = null;
      }
    }, this.intervalMs);
  }

  stop(): void {
    if (!this.isRunning) {
      // Task runner is not running or already stopped.
      return;
    }
    this.isRunning = false; // Signal to stop scheduling/running

    if (this.timerId !== null) {
      // clearTimeout works for both setTimeout and setInterval IDs
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  get running(): boolean {
    return this.isRunning;
  }

  // Renamed to avoid confusion and make it clear it's internal execution logic
  private async executeTaskInternal(): Promise<void> {
    try {
      await this.task();
    } catch (error) {
      console.error("Error during periodic task execution:", error);
      // Optional: Decide if you want to stop the runner on error
      this.stop();
    }
    // No 'finally' needed here for scheduling; it's handled in scheduleNext's callback
  }
}
