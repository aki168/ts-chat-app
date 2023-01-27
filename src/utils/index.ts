export const name = "bruce";

export const titleFormatter = (roomTitle: string): string => {
  switch (roomTitle) {
    case 'composite': return '綜合聊天室'
    case 'financial': return '投資理財區'
    case 'web3': return 'web3 技術討論'
    case 'other': return '各種雜談閒聊'
    default: return '--'
  }
} 