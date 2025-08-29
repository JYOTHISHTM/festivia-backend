export function generateRoomId(userId: string, creatorId: string) {
  const sortedIds = [userId, creatorId].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
}
