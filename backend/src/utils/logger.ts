type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  tenantId?: string;
  requestId?: string;
  route?: string;
  latencyMs?: number;
  error?: Error;
  [key: string]: any;
}

export const logger = {
  info(message: string, meta?: Partial<LogEntry>) {
    console.log(JSON.stringify({ level: "info", message, ...meta, timestamp: new Date().toISOString() }));
  },
  
  warn(message: string, meta?: Partial<LogEntry>) {
    console.warn(JSON.stringify({ level: "warn", message, ...meta, timestamp: new Date().toISOString() }));
  },
  
  error(message: string, error?: Error, meta?: Partial<LogEntry>) {
    console.error(JSON.stringify({
      level: "error",
      message,
      error: error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
  
  debug(message: string, meta?: Partial<LogEntry>) {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify({ level: "debug", message, ...meta, timestamp: new Date().toISOString() }));
    }
  },
};

