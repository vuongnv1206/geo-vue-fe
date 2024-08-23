import { optionsActionType } from './types'

export const ActionEnum = {
  Create: {
    Action: 'create',
    Color: '#28a745',
  },
  Update: {
    Action: 'update',
    Color: '#007bff',
  },
  Delete: {
    Action: 'delete',
    Color: '#dc3545',
  },
  Default: {
    Color: '#6c757d',
  },
}

export const pageSizeOptions: number[] = [10, 25, 50, 100, 250]
export const optionsAction: optionsActionType[] = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Create',
    value: 'create',
  },
  {
    label: 'Update',
    value: 'update',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
]

export const Mock_Data = {
  data: [
    {
      id: 'f14c0000-2659-0492-42ea-08dc952904d8',
      author: {
        id: '7739f0da-7bb1-443d-89c6-2ada60bccb6c',
        name: 'root Teacher',
        email: 'admin@root.com',
        imageUrl: 'https://picsum.photos/200/300',
      },
      action: 'Update',
      resource: 'Classes',
      resourceId: '8aa00cae-8ac4-4075-9836-25bde2a90f1a',
      createdAt: '2024-06-25T15:10:58.724734+07:00',
    },
    {
      id: 'f14c0000-2659-0492-41fb-08dc952904d8',
      author: {
        id: '7739f0da-7bb1-443d-89c6-2ada60bccb6c',
        name: 'root Teacher',
        email: 'admin@root.com',
        imageUrl: 'https://picsum.photos/200/300',
      },
      action: 'Update',
      resource: 'Classes',
      resourceId: '693a4a76-f7be-485d-bd78-c3db6e64e6e3',
      createdAt: '2024-06-25T15:10:58.72471+07:00',
    },
    {
      id: 'f14c0000-2659-0492-4110-08dc952904d8',
      author: {
        id: '7739f0da-7bb1-443d-89c6-2ada60bccb6c',
        name: 'root Teacher',
        email: 'admin@root.com',
        imageUrl: 'https://picsum.photos/200/300',
      },
      action: 'Update',
      resource: 'Classes',
      resourceId: '88725b06-37e2-4a6b-8cf7-4072db4080f5',
      createdAt: '2024-06-25T15:10:58.724686+07:00',
    },
    {
      id: 'f14c0000-2659-0492-3ffa-08dc952904d8',
      author: {
        id: '7739f0da-7bb1-443d-89c6-2ada60bccb6c',
        name: 'root Teacher',
        email: 'admin@root.com',
        imageUrl: 'https://picsum.photos/200/300',
      },
      action: 'Update',
      resource: 'Classes',
      resourceId: 'd984bfb5-30a0-4bad-b181-1783d0de269e',
      createdAt: '2024-06-25T15:10:58.724658+07:00',
    },
    {
      id: 'f14c0000-2659-0492-3def-08dc952904cf',
      author: {
        id: '7739f0da-7bb1-443d-89c6-2ada60bccb6c',
        name: 'root Teacher',
        email: 'admin@root.com',
        imageUrl: 'https://picsum.photos/200/300',
      },
      action: 'Create',
      resource: 'Classes',
      resourceId: 'd984bfb5-30a0-4bad-b181-1783d0de269e',
      createdAt: '2024-06-25T15:10:58.665624+07:00',
    },
  ],
  currentPage: 1,
  totalPages: 1,
  totalCount: 8,
  pageSize: 10,
  hasPreviousPage: false,
  hasNextPage: false,
}
