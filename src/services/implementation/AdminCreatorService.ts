import { IAdminCreatorService } from "../interface/IAdminCreatorService";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { sendMail } from "../../utils/mailer";
import { ICreator } from "../../models/Creator";
import { CREATOR_APPROVAL_EmailTemplates } from "../../utils/mailer";
import { CREATOR_REJECTION_EmailTemplates } from "../../utils/mailer";
import { Messages } from "../../enums/StatusCodes";


class AdminCreatorService implements IAdminCreatorService {

    private _creatorRepository: ICreatorRepository;
    private _adminRepository: IAdminRepository;

    constructor(
        creatorRepository: ICreatorRepository,
        adminRepository: IAdminRepository
    ) {
        this._creatorRepository = creatorRepository;
        this._adminRepository = adminRepository;
    }


    async getPendingCreators(): Promise<ICreator[]> {
        return await this._creatorRepository.findPendingCreators();
    }

    async getCreatorsBySearch(search: string) {
        return await this._adminRepository.searchCreators(search);
    };

    async getCreatorStatus(creatorId: string): Promise<ICreator | null> {
        try {
            const creator = await this._creatorRepository.getCreatorStatus(creatorId);
            return creator;
        } catch (error) {
            throw new Error(Messages.ERROR_FETCHING_CREATOR_STATUS);
        }
    }

    async blockCreator(creatorId: string): Promise<any> {
        return await this._creatorRepository.toggleBlock(creatorId);
    }

    async handleCreatorReapply(creatorId: string): Promise<any> {
        return await this._adminRepository.updateCreatorStatusToPending(creatorId);
    }

    async approveCreator(creatorId: string) {
        const creator = await this._creatorRepository.approveCreator(creatorId);
        if (creator) {
            const { subject, message } = CREATOR_APPROVAL_EmailTemplates.CREATOR_APPROVAL(creator.name);
            await sendMail(creator.email, subject, message);
        }
        return creator;
    }

    async getCreators(): Promise<any> {
        return await this._creatorRepository.findAll();
    }

    async rejectCreator(creatorId: string, rejectionReason: string): Promise<ICreator | null> {
        const creator = await this._creatorRepository.rejectCreator(creatorId, rejectionReason);
        if (creator) {
            const { subject, message } = CREATOR_REJECTION_EmailTemplates.CREATOR_REJECTION(creator.name, rejectionReason);
            await sendMail(creator.email, subject, message);
        }

        return creator;
    }
}

export default AdminCreatorService