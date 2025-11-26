/**
 * Type definitions for the Civic Issue Reporting App
 * Note: These are JSDoc comments for JavaScript type hints
 */

/**
 * @typedef {Object} Location
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {string} address
 * @property {Object} [coordinates]
 * @property {number} coordinates.lat
 * @property {number} coordinates.lng
 */

/**
 * @typedef {Object} Person
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [department]
 * @property {string} [role]
 */

/**
 * @typedef {Object} IssueUpdate
 * @property {string} id
 * @property {string} message
 * @property {Object} author
 * @property {string} author.name
 * @property {'citizen' | 'admin'} author.role
 * @property {string} timestamp
 */

/**
 * @typedef {'pothole' | 'streetlight' | 'trash' | 'graffiti' | 'signage' | 'water' | 'sidewalk' | 'other'} IssueCategory
 */

/**
 * @typedef {'submitted' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed'} IssueStatus
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'urgent'} IssuePriority
 */

/**
 * @typedef {Object} Issue
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {IssueCategory} category
 * @property {IssueStatus} status
 * @property {IssuePriority} priority
 * @property {Location} location
 * @property {string[]} [photos]
 * @property {string[]} [images]
 * @property {Person} [reportedBy]
 * @property {string} [submittedBy]
 * @property {Person | string} [assignedTo]
 * @property {string} [assignedDepartment]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {Date} [submittedAt]
 * @property {string | Date} [resolvedAt]
 * @property {Date} [actualResolution]
 * @property {string} [department]
 * @property {string | Date} [estimatedResolution]
 * @property {IssueUpdate[]} updates
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'citizen' | 'admin' | 'central-admin'} role
 * @property {string} [department]
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {IssueCategory[]} categories
 */

/**
 * @typedef {Object} Analytics
 * @property {number} totalReports
 * @property {number} resolvedReports
 * @property {number} averageResolutionTime
 * @property {Record<IssueCategory, number>} reportsByCategory
 * @property {Record<IssueStatus, number>} reportsByStatus
 * @property {Record<string, number>} reportsByDepartment
 * @property {Array<{date: string, reports: number, resolved: number}>} trendsData
 * @property {number} [totalIssues]
 * @property {number} [resolvedIssues]
 * @property {Record<IssueCategory, number>} [issuesByCategory]
 * @property {Record<IssueStatus, number>} [issuesByStatus]
 * @property {Record<IssuePriority, number>} [issuesByPriority]
 * @property {Array<{department: string, totalAssigned: number, resolved: number, averageTime: number}>} [departmentPerformance]
 * @property {Array<{month: string, submitted: number, resolved: number}>} [monthlyTrends]
 */

export {};
