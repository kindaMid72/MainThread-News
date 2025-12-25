import createDatabaseAccess from "../config/database/createDbAccess";

export default async function logAdminAction({  
    adminId,
    action,
    entityId,
    entityType,
    metadata}:{adminId?:string,action?:string,entityId?:string, entityType?:string,metadata?:object}) {
    try {
        console.log('masuk nih log');
        const dbAccess = await createDatabaseAccess();
        const {data, error:insertError} = await dbAccess.from('activity_logs').insert({
            user_id: adminId,
            action: action,
            entity_id: entityId,
            entity_type: entityType,
            metadata: metadata
        })
        console.log(insertError);
        if(insertError){
            throw new Error(insertError.message)
        }
        } catch (error) {
        console.log('error occured in logAdminAction: ', error);
    }
}