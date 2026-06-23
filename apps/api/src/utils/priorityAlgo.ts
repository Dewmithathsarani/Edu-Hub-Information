export interface TaskPriorityInput {
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

export const calculatePriorityScore = (task: TaskPriorityInput): number => {
  const now = new Date();
  const hoursLeft = (task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Overdue tasks always get maximum score
  if (hoursLeft < 0) {
    return 100;
  }

  // Urgency weight: 0 to 100 based on hours left (max 168 hours = 7 days)
  const urgencyWeight = Math.max(0, 100 - (Math.min(hoursLeft, 168) / 168) * 100);

  // Importance weight
  let importanceWeight = 25;
  if (task.priority === 'urgent') importanceWeight = 100;
  else if (task.priority === 'high') importanceWeight = 75;
  else if (task.priority === 'medium') importanceWeight = 50;

  // Final score: 60% urgency, 40% importance
  const score = (urgencyWeight * 0.6) + (importanceWeight * 0.4);

  return Math.round(score * 10) / 10; // Round to 1 decimal place
};

export const sortTasksByPriority = <T extends TaskPriorityInput>(tasks: T[]): T[] => {
  return tasks.sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Descending score
    }
    
    // Tie-breaker: earlier creation date wins
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
};
