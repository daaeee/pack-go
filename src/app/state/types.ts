export type BoxStatus = 'packed' | 'in_transit' | 'delivered' | 'unpacked'

export type Room = {
  id: string
  name: string
}

export type Box = {
  id: string
  title: string
  roomId: string
  itemsPreview: string
  fragile: boolean
  status: BoxStatus
  createdAt: string
}

export type Carrier = {
  id: string
  name: string
  priceFromRub: number
  rating: number
  reviews: number
  phone?: string
  website?: string
}

export type MoveHistoryItem = {
  id: string
  title: string
  dateRange: string
  archived?: boolean
}

export type Notifications = {
  email: boolean
  sms: boolean
  phoneVerified: boolean
}

export type UserProfile = {
  name: string
  surname: string
  email: string
  phone: string
  notifications: Notifications
  moves: MoveHistoryItem[]
}

export type PackGoState = {
  rooms: Room[]
  boxes: Box[]
  carriers: Carrier[]
  profile: UserProfile
}

export type PackGoActions = {
  setBoxStatus: (boxId: string, status: BoxStatus) => void
  updateProfile: (patch: Partial<Pick<UserProfile, 'name' | 'surname'>>) => void
  toggleNotification: (key: keyof Pick<Notifications, 'email' | 'sms'>) => void
  verifyPhone: () => void
  addBox: (box: Omit<Box, 'id' | 'createdAt'>) => string
}

