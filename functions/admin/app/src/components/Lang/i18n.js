export const LANG = {
  ENG: 'en',
  RUS: 'ru',
}

const { ENG, RUS } = LANG

const i18n = {
  HEADER: {
    TITLE: {
      [ENG]: 'Constructor',
      [RUS]: 'Конструктор',
    },
  },
  MAIN_MENU: {
    HOME: {
      [ENG]: 'Home',
      [RUS]: 'Главная',
    },
    STEPS: {
      [ENG]: 'Story Steps',
      [RUS]: 'История',
    },
    MANAGERS: {
      [ENG]: 'Managers',
      [RUS]: 'Менеджеры',
    },
  },
  ERROR: {
    UNAUTHORIZED: {
      [ENG]: "You don't have enough rights",
      [RUS]: 'У Вас недостаточно прав для просмотра',
    },
  },
  AUTH: {
    LOGIN_BUTTON: {
      [ENG]: 'login',
      [RUS]: 'Вход',
    },
    TITLE: {
      [ENG]: 'Sign In',
      [RUS]: 'Вход',
    },
    EMAIL_INPUT: {
      [ENG]: 'Email',
      [RUS]: 'Почта',
    },
    EMAIL_PLACEHOLDER: {
      [ENG]: 'Please input your email',
      [RUS]: 'Введите свой email',
    },
    PASSWORD_INPUT: {
      [ENG]: 'Password',
      [RUS]: 'Пароль',
    },
    PASSWORD_PLACEHOLDER: {
      [ENG]: 'Please input your password',
      [RUS]: 'Введите свой пароль',
    },
    LANGUAGE_SELECT: {
      [ENG]: 'Language',
      [RUS]: 'Язык',
    },
    LANGUAGE_SELECT_PLACEHOLDER: {
      [ENG]: 'Please select language',
      [RUS]: 'Выберите язык',
    }
  },
  HOME: {
    TITLE: {
      [ENG]: 'Home',
      [RUS]: 'Главная',
    },
  },
  STEPS: {
    TITLE: {
      [ENG]: 'Story Steps',
      [RUS]: 'Этапы истории',
    },
  },
  CREATE_STEP: {
    TITLE: {
      [ENG]: 'Create Story Step',
      [RUS]: 'Создание этапа истории',
    },
    MODELS_TITLE: {
      [ENG]: 'Models for publish',
      [RUS]: 'Модели для публикации',
    },
    STEP_BLOCK_TITLE: {
      [ENG]: 'Story Step',
      [RUS]: 'Этап истории',
    },
    FORM: {
      MODELS_PLACEHOLDER: {
        [ENG]: 'Please add models',
        [RUS]: 'Добавьте модели',
      },
      TITLE: {
        [ENG]: 'Title',
        [RUS]: 'Название',
      },
      TITLE_PLACEHOLDER: {
        [ENG]: 'Please input Story Step title',
        [RUS]: 'Введите название этапа',
      },
      STATUS: {
        [ENG]: 'Step Status',
        [RUS]: 'Статус этапа',
      },
      STATUSES: {
        WAIT_APPROVE: {
          [ENG]: 'Wait approve',
          [RUS]: 'Ожидает подтверждения',
        },
        APPROVED: {
          [ENG]: 'Published',
          [RUS]: 'Опубликован',
        },
        CLOSED: {
          [ENG]: 'Closed',
          [RUS]: 'Закрыт',
        },
      },
      SPECIAL_DATES: {
        [ENG]: 'Story Step Dates',
        [RUS]: 'Даты этапа',
      },
      SPECIAL_DATES_PLACEHOLDER: {
        [ENG]: 'Please input Story Step dates',
        [RUS]: 'Выберите обе даты этапа',
      },
      SAVE_STEP_BUTTON: {
        [ENG]: 'Save Story Step',
        [RUS]: 'Сохранить этап',
      }
    },
  },
  MANAGERS: {
    TITLE: {
      [ENG]: 'Managers',
      [RUS]: 'Управление менеджерами',
    },
  },
}

export default i18n
