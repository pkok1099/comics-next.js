/**
 * Creates a Winston logger instance.
 *
 * @module logger
 */

/**
 * The Winston logger instance.
 *
 * @type {winston.Logger}
 */
const winston = require("winston");

/**
 * Creates a new Winston logger instance.
 *
 * @param {object} options - The logger options.
 * @param {string} options.level - The logging level.
 * @param {winston.Format} options.format - The logging format.
 * @param {winston.Transport[]} options.transports - The logging transports.
 *
 * @returns {winston.Logger} The created logger instance.
 */
const logger = winston.createLogger({
  /**
   * The logging level. Set to 'error' in production environment, 'info' otherwise.
   *
   * @type {string}
   */
  level: process.env.NODE_ENV === "production" ? "error" : "info",
  /**
   * The logging format. Set to JSON format with timestamp.
   *
   * @type {winston.Format}
   */
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  /**
   * The logging transports.
   *
   * @type {winston.Transport[]}
   */
  transports: [
    /**
     * The error log transport.
     *
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: "error.log", level: "error" }),
    /**
     * The combined log transport.
     *
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: "combined.log" }),
    /**
     * The console log transport.
     *
     * @type {winston.transports.Console}
     */
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  /**
   * The exception handling.
   *
   * @type {object}
   */
  exceptionHandlers: [
    /**
     * The exception handler for file transport.
     *
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
  /**
   * The rejection handling.
   *
   * @type {object}
   */
  rejectionHandlers: [
    /**
     * The rejection handler for file transport.
     *
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});

/**
 * Exports the logger instance.
 *
 * @exports logger
 */
exports.logger = logger;
