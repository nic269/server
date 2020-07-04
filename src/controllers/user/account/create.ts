// Types
import { Request, Response } from 'express';

// Tools
import logger from '../../../tools/logger';
import { saveLog } from '../../../tools/user/logs';

// Models
import model from '../../../db/models';

const createAccount = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const findUsername = await model.MEMB_INFO.findOne({
      where: { memb___id: username }
    });

    if (findUsername) {
      return res.json({ error: 'This Username has already been taken' });
    }

    const findEmail = await model.MEMB_INFO.findOne({
      where: { mail_addr: email }
    });

    if (findEmail) {
      return res.json({ error: 'This E-Mail address is already in use' });
    }

    const config = await model._anwConfig.findOne({
      where: {
        name: 'resources'
      }
    });

    if (!config) {
      return res.status(400).json({ error: 'Resources config not found' });
    }

    await Promise.all([
      model._anwResources.create({
        account: username,
        resources: config.value,
        items:
          '16fd16ffffffff7f0008af0000000000037F798259A9007F0580000000000000247FFF29499A005F00C000000000000013cc815e5aa900550540af00000000001508ff486384380000e00000000000001508ff348121350000e00000000000001508ff652522530000e00000000000000504d75e5aa9004400c0000000000000'
      }),
      model.MEMB_INFO.create({
        memb___id: username,
        memb__pwd: password,
        mail_addr: email,
        memb_name: username,
        reg_ip: req.ip,
        sno__numb: '1111111111111',
      }),
      saveLog({
        account: username,
        module: 'register',
        message: `Account was created.`,
        ip: req.ip
      })
    ]);

    res.json({ success: 'Registration successful' });
  } catch (error) {
    logger.error({ error, res });
  }
};

export default createAccount;
