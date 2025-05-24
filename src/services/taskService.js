const { ApperClient } = window.ApperSDK;

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'task';

// All fields for fetching (includes read-only and system fields)
const ALL_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'DeletedOn', 'DeletedBy', 'IsDeleted', 'InSandbox', 'title', 'description', 
  'priority', 'category', 'dueDate', 'completed', 'createdAt', 'updatedAt'
];

// Only updateable fields for create/update operations
const UPDATEABLE_FIELDS = [
  'title', 'description', 'priority', 'category', 'dueDate', 'completed'
];

export const taskService = {
  // Fetch all tasks with filtering and pagination
  async fetchTasks(params = {}) {
    try {
      const requestParams = {
        fields: ALL_FIELDS,
        orderBy: [
          {
            fieldName: "createdAt",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: params.limit || 50,
          offset: params.offset || 0
        }
      };

      // Add filtering conditions if provided
      if (params.where && params.where.length > 0) {
        requestParams.where = params.where;
      }

      // Add search functionality
      if (params.search) {
        requestParams.whereGroups = [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [params.search]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [params.search]
                  }
                ],
                operator: ""
              }
            ]
          }
        ];
      }

      // Add filter conditions
      if (params.filter) {
        const filterConditions = [];
        
        switch (params.filter) {
          case 'completed':
            filterConditions.push({
              fieldName: "completed",
              operator: "ExactMatch",
              values: [true]
            });
            break;
          case 'pending':
            filterConditions.push({
              fieldName: "completed",
              operator: "ExactMatch",
              values: [false]
            });
            break;
          case 'overdue':
            filterConditions.push(
              {
                fieldName: "completed",
                operator: "ExactMatch",
                values: [false]
              },
              {
                fieldName: "dueDate",
                operator: "LessThan",
                values: [new Date().toISOString().split('T')[0]]
              }
            );
            break;
        }

        if (filterConditions.length > 0) {
          requestParams.where = (requestParams.where || []).concat(filterConditions);
        }
      }

      const response = await apperClient.fetchRecords(TABLE_NAME, requestParams);

      if (!response || !response.data) {
        return { data: [], total: 0 };
      }

      return {
        data: response.data,
        total: response.totalRecords || response.data.length
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks. Please try again.");
    }
  },

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      const params = {
        fields: ALL_FIELDS
      };

      const response = await apperClient.getRecordById(TABLE_NAME, taskId, params);

      if (!response || !response.data) {
        throw new Error("Task not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw new Error("Failed to fetch task. Please try again.");
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (taskData.hasOwnProperty(field)) {
          filteredData[field] = taskData[field];
        }
      });

      // Format data according to field types
      if (filteredData.dueDate && filteredData.dueDate !== '') {
        filteredData.dueDate = filteredData.dueDate; // Date format: YYYY-MM-DD
      } else {
        delete filteredData.dueDate; // Remove empty dates
      }

      // Ensure boolean fields are proper booleans
      if (filteredData.hasOwnProperty('completed')) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Set default timestamps
      filteredData.createdAt = new Date().toISOString();
      filteredData.updatedAt = new Date().toISOString();

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        return response.results[0].data;
      } else {
        const errorMessage = response?.results?.[0]?.message || "Failed to create task";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task. Please try again.");
    }
  },

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      // Filter to only include updateable fields + ID
      const filteredData = { Id: taskId };
      UPDATEABLE_FIELDS.forEach(field => {
        if (taskData.hasOwnProperty(field)) {
          filteredData[field] = taskData[field];
        }
      });

      // Format data according to field types
      if (filteredData.dueDate && filteredData.dueDate !== '') {
        filteredData.dueDate = filteredData.dueDate; // Date format: YYYY-MM-DD
      } else if (filteredData.hasOwnProperty('dueDate')) {
        filteredData.dueDate = null; // Set to null for empty dates
      }

      // Ensure boolean fields are proper booleans
      if (filteredData.hasOwnProperty('completed')) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Update timestamp
      filteredData.updatedAt = new Date().toISOString();

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        return response.results[0].data;
      } else {
        const errorMessage = response?.results?.[0]?.message || "Failed to update task";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task. Please try again.");
    }
  },

  // Delete a task
  async deleteTask(taskId) {
    try {
      const params = {
        RecordIds: [taskId]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (response && response.success && response.results && response.results[0] && response.results[0].success) {
        return true;
      } else {
        const errorMessage = response?.results?.[0]?.message || "Failed to delete task";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task. Please try again.");
    }
  },

  // Bulk delete tasks
  async deleteTasks(taskIds) {
    try {
      const params = {
        RecordIds: taskIds
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (response && response.success) {
        const successfulDeletions = response.results?.filter(result => result.success) || [];
        return successfulDeletions.length;
      } else {
        throw new Error("Failed to delete tasks");
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      throw new Error("Failed to delete tasks. Please try again.");
    }
  }
};

export default taskService;