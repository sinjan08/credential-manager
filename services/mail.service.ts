import {transporter} from "@/config/mail.config";
import {templates} from "@/lib/templates.lib";
import {parseTemplate} from "@/utils/common.utils";

type TemplateType = keyof typeof templates;

interface SendMailOptions {
    to: string;
    subject: string;
    template: TemplateType;
    data: Record<string, string>;
}

export const sendMail = async ({
                                   to,
                                   subject,
                                   template,
                                   data,
                               }: SendMailOptions) => {
    try {
        // get template string
        const rawTemplate = templates[template];

        if (!rawTemplate) {
            throw new Error(`Template "${template}" not found`);
        }

        // parse template
        const html = parseTemplate(rawTemplate, data);

        // send mail
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to,
            subject,
            html,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Mail Error:", error);
        throw new Error("Mail sending failed");
    }
};