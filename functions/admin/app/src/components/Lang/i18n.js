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
      TITLE: {
        [ENG]: 'Story Steps',
        [RUS]: 'История',
      },
      LIST: {
        [ENG]: 'Story Step List',
        [RUS]: 'Этапы истории',
      },
      CREATE: {
        [ENG]: 'Create Story Step',
        [RUS]: 'Создать этап',
      },
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
  EDIT_STEP: {
    CREATE_TITLE: {
      [ENG]: 'Create Story Step',
      [RUS]: 'Создание этапа истории',
    },
    EDIT_TITLE: {
      [ENG]: 'Edit Story Step',
      [RUS]: 'Редактирование этапа истории',
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
      DESCRIPTION: {
        [ENG]: 'Description',
        [RUS]: 'Описание',
      },
      DESCRIPTION_PLACEHOLDER: {
        [ENG]: 'Please input description',
        [RUS]: 'Введите описание этапа',
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
      SPECIAL_DATES_ALWAYS: {
        [ENG]: '(Always)',
        [RUS]: '(Всегда)',
      },
      SAVE_STEP_BUTTON: {
        [ENG]: 'Save Story Step',
        [RUS]: 'Сохранить этап',
      },
      UPLOAD_IMAGE: {
        [ENG]: 'Story Step image',
        [RUS]: 'Изображение этапа',
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: {
        [ENG]: 'Successful Story Step saving',
        [RUS]: 'Этап сохранен',
      },
      SAVE_ERROR: {
        [ENG]: 'Error Story Step saving',
        [RUS]: 'Ошибка сохранения этапа',
      },
    },
  },
  STEPS_LIST: {
    TITLE: {
      [ENG]: 'Story Steps',
      [RUS]: 'Этапы истории',
    },
    COLUMNS: {
      IMAGE: {
        [ENG]: 'Image',
        [RUS]: 'Изображение',
      },
      STATUS: {
        [ENG]: 'Status',
        [RUS]: 'Статус',
      },
      TITLE: {
        [ENG]: 'Title',
        [RUS]: 'Название',
      },
      DESCRIPTION: {
        [ENG]: 'Description',
        [RUS]: 'Описание',
      },
      MODELS_COUNT: {
        [ENG]: 'Models',
        [RUS]: 'Модели',
      },
      SPECIAL_DATES: {
        [ENG]: 'Dates',
        [RUS]: 'Даты',
      },
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
