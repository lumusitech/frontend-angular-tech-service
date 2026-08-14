import { AppNotification } from '../models/notification.interfaces';

export function getSearchTerm(notification: AppNotification): string {
  const meta = notification.metadata;

  if (meta) {
    if (notification.referenceType === 'work_order' || notification.referenceType === 'task') {
      return (meta['trackingCode'] as string) || '';
    }
    if (notification.referenceType === 'payment') {
      return (meta['trackingCode'] as string) || '';
    }
    if (notification.referenceType === 'pending_item') {
      return (meta['title'] as string) || '';
    }
    if (
      notification.referenceType === 'work_order' &&
      (notification.type === 'work_order.note_added' ||
        notification.type === 'work_order.note_updated' ||
        notification.type === 'work_order.note_deleted' ||
        notification.type === 'work_order.material_added')
    ) {
      return (meta?.['trackingCode'] as string) || '';
    }

    if (notification.referenceType === 'inquiry') {
      return (meta['clientName'] as string) || '';
    }
  }

  const msg = notification.message;

  if (
    notification.referenceType === 'work_order' ||
    notification.referenceType === 'task' ||
    notification.referenceType === 'payment'
  ) {
    const match = msg.match(/\b([A-Z]{2}-\w+)\b/);
    if (match) return match[1];
  }

  if (notification.referenceType === 'pending_item') {
    let match = msg.match(/Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i);
    if (match) return match[1].trim();
    match = msg.match(/^(.+?)\s+(?:vence\s+hoy|está\s+vencid[oa])/i);
    if (match) return match[1].trim();
  }

  if (notification.referenceType === 'inquiry') {
    let match = msg.match(/(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i);
    if (match) return match[1].trim();
    match = msg.match(/(?:asignada|contactada)\s+a\s+(.+?)(?:\s*[—–-]|$)/i);
    if (match) return match[1].trim();
    match = msg.match(/(?:de|a)\s+(.+?)(?:\s*[—–-]|$)/);
    if (match) return match[1].trim();
  }

  return '';
}
