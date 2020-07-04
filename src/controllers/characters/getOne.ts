// Types
import { Request, Response } from 'express';

// Tools
import logger from '../../tools/logger';

// Models
import model from '../../db/models';

const getOne = async (req: Request, res: Response) => {
  try {
    const { name: Name } = req.params;

    const character = await model.Character.findOne({
      where: { Name },
      attributes: {
        exclude: [
          'Quest',
          'AccountID',
          // Invalid column for Season iX
          'BanCharTime',
          'BanChatTime',
          'BanPostTime',
          'SkyEventWins',
          'VipExpirationTime',
          'GrandResets',
          'BanPost',
          'IsMarried',
          'QuestNumber',
          'QuestMonsters',
          'QuestInCurse',
          'QuestInProgress',
          'IsVip'
        ]
      },
      include: [
        {
          model: model.MEMB_STAT,
          attributes: {
            exclude: ['memb___id']
          }
        },
        {
          model: model.AccountCharacter,
          attributes: {
            exclude: ['Id']
          }
        },
        {
          model: model.GuildMember
        }
      ]
    });

    const result: any = character.toJSON();

    result.totalPoints =
      result.LevelUpPoint +
      result.Strength +
      result.Dexterity +
      result.Vitality +
      result.Energy +
      result.Leadership;

    [
      'LevelUpPoint',
      'Strength',
      'Dexterity',
      'Vitality',
      'Energy',
      'Leadership'
    ].forEach(key => delete result[key]);

    result.Inventory = result.Inventory.toString('hex');
    result.MagicList = result.MagicList.toString('hex');

    res.json(result);
  } catch (error) {
    logger.error({ error, res });
  }
};

export default getOne;
