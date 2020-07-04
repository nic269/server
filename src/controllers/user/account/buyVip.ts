// Types
import { Request, Response } from 'express';
import moment from 'moment';
import momentTz from 'moment-timezone';

// Tools
import logger from '../../../tools/logger';
import { saveLog } from '../../../tools/user/logs';

// Models
import model from '../../../db/models';

momentTz.tz.setDefault('Atlantic/Azores');

const buyVip = async (req: Request, res: Response) => {
  try {
    const { vipDays, type } = req.body;

    const vipInfo = await model.T_VIPList.findOne({
      where: {
        AccountID: req.username
      },
    });

    const resources = await model._anwResources.findOne({
      where: {
        account: req.username
      }
    });

    const config = await model._anwConfig.findOne({
      where: {
        name: 'vip'
      }
    });

    if (!vipInfo) {
      return res.status(400).json({ error: 'Could not read user data' });
    }

    if (!resources) {
      return res
        .status(400)
        .json({ error: 'Could not find resources for this user' });
    }

    if (!config) {
      return res.status(400).json({ error: 'Could not find config for VIP' });
    }

    const vipTypeBuffer = type || vipInfo.Type;
    const credits = vipDays * vipTypeBuffer * Number(config.value);

    if (resources.credits < credits) {
      return res.status(400).json({
        error: `You need ${credits} credits to buy vip for ${vipDays} days.`
      });
    }

    resources.credits -= credits;

    const newVipDate = moment(vipInfo.Date).isAfter(moment())
      ? moment(vipInfo.Date).add(vipDays, 'days')
      : moment().add(vipDays, 'days');

    vipInfo.Date = newVipDate.format('YYYY-MM-DD HH:mm:ss');
    vipInfo.Type = type;

    await Promise.all([
      resources.save(),
      vipInfo.save(),
      saveLog({
        account: req.username,
        module: 'vip',
        message: `Purchased {highlight:${vipDays}} days VIP status for {highlight:${credits}} credits.`,
        ip: req.ip
      })
    ]);

    res.json({
      success: 'You purchased VIP successfully',
      info: vipInfo,
      credits: resources.credits
    });
  } catch (error) {
    logger.error({ error, res });
  }
};

export default buyVip;
