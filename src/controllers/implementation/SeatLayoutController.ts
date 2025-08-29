import { Request, Response } from 'express';
import { StatusCodes } from "../../enums/StatusCodes";
import { ISeatLayoutController } from '../interface/ISeatLayoutController';
import { ISeatLayoutService } from '../../services/interface/ISeatLayoutService';
import { SeatLayoutMessages } from '../../enums/StatusCodes';
import { LayoutTypes } from '../../enums/LayoutTypes';



class SeatLayoutController implements ISeatLayoutController {
  constructor(private _seatLayoutService: ISeatLayoutService) { }

  public async createLayout(req: Request, res: Response): Promise<void> {
    try {
      const { layoutType, totalSeats, price } = req.body;
      const { creatorId } = req.params;

      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.CREATOR_ID_REQUIRED });
        return;
      }

      if (!layoutType || !totalSeats) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.REQUIRED_FIELDS });
        return;
      }

      let normalPrice: number | undefined;
      let balconyPrices: { normal: number; premium: number } | undefined;
      let reclanarPrices: { reclanar: number; reclanarPlus: number } | undefined;

      switch (layoutType) {
        case LayoutTypes.NORMAL:
        case LayoutTypes.CENTERED_SCREEN:
          if (typeof price !== 'number') {
            res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.INVALID_PRICE_TYPE });
            return;
          }
          normalPrice = price;
          break;

        case LayoutTypes.WITH_BALCONY:
          if (!price || typeof price.normal !== 'number' || typeof price.premium !== 'number') {
            res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.INVALID_BALCONY_PRICE });
            return;
          }
          balconyPrices = price;
          break;

        case LayoutTypes.RECLANAR:
          if (!price || typeof price.reclanar !== 'number' || typeof price.reclanarPlus !== 'number') {
            res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.INVALID_RECLANAR_PRICE });
            return;
          }
          reclanarPrices = price;
          break;

        default:
          res.status(StatusCodes.BAD_REQUEST).json({ message: SeatLayoutMessages.INVALID_LAYOUT_TYPE });
          return;
      }

      const layoutData = {
        layoutType,
        totalSeats,
        creatorId,
        isUsed: false,
        normalPrice,
        balconyPrices,
        reclanarPrices,
        seats: [],
      };

      const layout = await this._seatLayoutService.createLayout(layoutData);
      res.status(StatusCodes.CREATED).json(layout);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: SeatLayoutMessages.FAILED_TO_SAVE,
        error: err,
      });
    }
  }

  public async getLayouts(_: Request, res: Response): Promise<void> {
    try {
      const layouts = await this._seatLayoutService.getAllLayouts();
      res.status(StatusCodes.OK).json(layouts);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: SeatLayoutMessages.RETRIEVE_FAILED, error: err });
    }
  }

  public async getLayoutsByCreatorId(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId } = req.params;
      const layouts = await this._seatLayoutService.getLayoutsByCreatorId(creatorId);
      res.status(StatusCodes.OK).json(layouts);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: SeatLayoutMessages.RETRIEVE_FAILED, error: err });
    }
  }
}


export default SeatLayoutController