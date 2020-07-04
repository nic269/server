import jwt from 'jsonwebtoken';

// Types
import { Request, Response } from 'express';

// Tools
import logger from '../../../tools/logger';
import { json } from '../../../tools/json';

// Models
import model from '../../../db/models';

interface Resource {
  group: number;
  id: number;
  level: number;
  value: number;
}

const verify = async (req: Request, res: Response) => {
  try {
    const token = req.header('anwAuthToken');

    if (!token) {
      return res.json({ error: 'Not authorized' });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    const user = await model.MEMB_INFO.findOne({
      where: {
        memb___id: decode.username,
        jwt_token: token
      },
      include: [
        { model: model._anwResources },
        { model: model.MEMB_STAT },
        { model: model.warehouse },
        { model: model.T_VIPList },
      ],
      attributes: [
        'memb___id',
        'memb_name',
        'sno__numb',
        'bloc_code',
        'ctl1_code',
        'reg_ip',
        'admin_lvl'
      ]
    });

    if (!user) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const config = await model._anwConfig.findOne({
      where: {
        name: 'resources'
      }
    });

    if (!config) {
      return res.status(400).json({ error: 'Resources config not found' });
    }

    const userJSON: any = user.toJSON();

    // Resources
    const resources: Resource[] | false =
      userJSON.resources && userJSON.resources.resources
        ? json.parse(userJSON.resources.resources)
        : false;

    const newResources: Resource[] = JSON.parse(config.value).map(
      (r: Resource) => {
        const find =
          resources &&
          resources.find(
            re => re.group === r.group && re.id === r.id && re.level === r.level
          );
        return !find ? r : find;
      }
    );

    await model._anwResources.update(
      { resources: JSON.stringify(newResources) },
      {
        where: { account: decode.username }
      }
    );

    if (!userJSON.resources || !userJSON.resources.resources) {
      const anwRes = await model._anwResources.create({
        account: user.memb___id,
        resources: JSON.stringify(newResources)
      });

      userJSON.resources = anwRes.toJSON();
    }

    userJSON.resources.list = JSON.stringify(newResources);
    delete userJSON.resources.resources;
    userJSON.resources.zen = Number(userJSON.resources.zen);

    // Warehouse
    userJSON.warehouse = {
      items: userJSON.warehouse.Items.toString('hex'),
      money: userJSON.warehouse.Money,
      lock: userJSON.warehouse.pw !== 0
    };

    res.json(userJSON);
  } catch (error) {
    logger.error({ error, res });
  }
};

export default verify;
