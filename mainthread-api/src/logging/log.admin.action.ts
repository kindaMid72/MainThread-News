import createDatabaseAccess from "../config/database/createDbAccess";

export default async function logAdminAction({
    adminId,
    action,
    entityId,
    entityType,
    metadata }: { adminId?: string, action?: string, entityId?: string, entityType?: string, metadata?: object }): Promise<void> {
    try {
        const dbAccess = await createDatabaseAccess();
        await dbAccess.from('activity_logs').insert({
            user_id: adminId,
            action: action,
            entity_id: entityId,
            entity_type: entityType,
            metadata: metadata
        })
    } catch (error) {
        console.log('error occured in logAdminAction: ', error);
    }
}