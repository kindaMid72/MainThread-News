// import resend
import { Resend } from "resend";

export const resend: Resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
