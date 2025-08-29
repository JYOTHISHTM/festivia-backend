import { Request, Response } from "express";
import { IAdminCreatorController } from "../interface/IAdminCreatorController";
import { IAdminCreatorService } from '../../services/interface/IAdminCreatorService'
import { StatusCodes, Messages } from "../../enums/StatusCodes";
import { creatorDTO } from "../../dto/creatorDto";



class AdminCreatorController implements IAdminCreatorController {

    private _adminCreatorService: IAdminCreatorService;

    constructor(adminCreatorService: IAdminCreatorService) {
        this._adminCreatorService = adminCreatorService;
    }


    async getCreatorsbySearch(req: Request, res: Response) {
        try {
            const search = req.query.search?.toString() || "";
            const creators = await this._adminCreatorService.getCreatorsBySearch(search);
            res.status(StatusCodes.OK).json(creators);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_FETCHING_CREATORS, error });
        }
    };


    async getPendingCreators(req: Request, res: Response) {
        try {
            const pendingCreators = await this._adminCreatorService.getPendingCreators();
            return res.status(StatusCodes.OK).json(pendingCreators);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.FETCH_PENDING_CREATORS_ERROR, error });
        }
    }


    async getCreatorStatus(req: Request, res: Response) {
        try {

            const { creatorId } = req.params;

            const creator = await this._adminCreatorService.getCreatorStatus(creatorId);

            if (!creator) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: Messages.CREATOR_NOT_FOUND });
            }

            return res.status(StatusCodes.OK).json({
                status: creator.status,
                rejectionReason: creator.rejectionReason || null,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_FETCHING_CREATOR_STATUS });
        }
    }



    async blockCreator(req: Request, res: Response): Promise<Response> {
        try {
            const { creatorId } = req.params;
            const creator = await this._adminCreatorService.blockCreator(creatorId);

            if (!creator) return res.status(StatusCodes.NOT_FOUND).json({ message: Messages.CREATOR_NOT_FOUND });

            return res.status(StatusCodes.OK).json({
                message: creator.isBlocked ? Messages.CREATOR_BLOCKED_SUCCESSFULLY : Messages.CREATOR_UNBLOCKED_SUCCESSFULLY,

                creator: creatorDTO(creator)
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_UPDATING_CREATOR_STATUS, error });
        }
    }

    async reapplyCreator(req: Request, res: Response): Promise<void> {
        try {
            const creatorId = req.params.id;

            const result = await this._adminCreatorService.handleCreatorReapply(creatorId);

            if (!result) {
                res.status(StatusCodes.NOT_FOUND).json({ message: Messages.CREATOR_NOT_FOUND });
            }

            res.status(StatusCodes.OK).json({ message: Messages.REAPPLIED_SUCCESSFULLY, creator: result });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }

    async getCreators(req: Request, res: Response): Promise<Response> {
        try {
            const creators = await this._adminCreatorService.getCreators();
            const safecreators = creators.map(creatorDTO);
            return res.status(StatusCodes.OK).json(safecreators);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: Messages.ERROR_FETCHING_CREATORS,
                error,
            });
        }
    }

    async approveCreator(req: Request, res: Response) {
        try {
            const { creatorId } = req.params;

            const creator = await this._adminCreatorService.approveCreator(creatorId);

            if (!creator) return res.status(StatusCodes.NOT_FOUND).json({ message: Messages.CREATOR_NOT_FOUND });

            return res.status(StatusCodes.OK).json({
                message: Messages.CREATOR_APPROVED_SUCCESSFULLY,
                creator,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_APPROVING_CREATOR, error });
        }
    }

    async rejectCreator(req: Request, res: Response) {
        try {
            const { creatorId } = req.params;
            const { rejectionReason } = req.body;

            if (!rejectionReason) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.REJECTION_REASON_IS_REQUIRED });
            }

            const creator = await this._adminCreatorService.rejectCreator(creatorId, rejectionReason);

            if (!creator) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: Messages.CREATOR_NOT_FOUND });
            }

            return res.status(StatusCodes.OK).json({
                message: Messages.CREATOR_REJECTED_SUCCESSFULLY,
                creator
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_REJECTING_CREATOR, error });
        }
    }


}



export default AdminCreatorController