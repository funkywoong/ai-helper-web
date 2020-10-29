import base64
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from PIL import Image

import sklearn
from sklearn.model_selection import train_test_split

PARAM_TYPE = {
    'svm' : {
        'SVC': {'C': 1.0, 'kernel': 'rbf', 'degree': 3, 'gamma': 'scale', 'coef0': 0.0, 'shrinking': True,
                'probability': False, 'tol': 1e-3, 'cache_size': 200, 'class_weight': None, 'verbose': False,
                'max_iter': -1, 'decision_function_shape': 'ovr', 'break_ties': False, 'random_state': 42
        }
    }, 
    'tree': {
        'DecisionTreeClassfier': {'criterion': 'gini', 'splitter': 'best', 'max_depth': None, 
                                'min_samples_split': 2, 'min_samples_leaf': 1, 'min_weight_function_leaf': 0.0, 
                                'max_features': None, 'random_state': 42, 'max_leaf_nodes': None,
                                'min_impurity_decrease': 0.0, 'min_impurity_split': 0, 'class_weight': None, 
                                'presort': 'deprecated'
        }
    }, 
    'ensemble': None, 
    'linear': None, 
    'neighbor': None, 
    'bayes': None
}

class SkHandler():
    def __init__(self):
        self._cls_name_list = None
        self._cls_img_list = None

        self._tg_est_type = str()
        self._tg_est = str()
        self._usr_param = dict()

        self.model = None

        self._X_train = []
        self._y_label = []

        self.file_cnt = 0

    def construct(self, whole_meta):
        keys = [key for key in whole_meta.keys() if 'Class' in key]
        print(keys)
        cls_names = []
        cls_img_list = []

        for val in training_meta.values():
            for src in val['imgSrc']:
                cls_img_list.append(self.__decoding_img(src).flatten())
                cls_names.append(val['name'])
        
        self._cls_name_list = np.array(cls_names)
        
        # for 
        self._cls_img_list = np.array(cls_img_list)

        print(self._cls_img_list.shape)
        print(self._cls_name_list.shape)
        print(self._cls_name_list)

    def training(self):
        self.model = self.__mdl_init()
        
        # self.model.fit()

    def training_test(self):
        self._tg_est_type = 'svm'
        self._tg_est = 'SVC'
        self._usr_param['random_state'] = 42
        self.__get_est_param()
        self.model = self.__mdl_init()

        print('user param: ', self._usr_param)
        print('model: ', self.model)

        X_train, X_test, y_train, y_test = train_test_split(
            self._cls_img_list, self._cls_name_list, test_size=0.2, shuffle=True, random_state=42
        )
        
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        print(np.array(y_pred == y_test)[:25])
        print('')
        print('Percentage correct: ', 100 * np.sum(y_pred == y_test) / len(y_test))

    def __mdl_init(self):
        if self._tg_est_type == 'svm':
            from sklearn.svm import SVC as EST
        elif self._tg_est_type == 'tree':
            from sklearn.tree import DecisionTreeClassifier as EST
        elif self._tg_est_type == 'ensemble':
            pass
        elif self._tg_est_type == 'linear':
            pass
        elif self._tg_est_type == 'neighbor':
            pass
        elif self._tg_est_type == 'bayes':
            pass

        model = EST()
        print(self._usr_param)
        model.set_params(**self._usr_param)

        return model

    def __get_est_param(self):
        tmp_param_dic = PARAM_TYPE[self._tg_est_type][self._tg_est]
        for key, new_value in self._usr_param.items():
            tmp_param_dic[key] = new_value
        self._usr_param = tmp_param_dic

    def __decoding_img(self, data_uri):
        encoded_img_b64 = data_uri.split(',')[1]
        decoded_img = Image.open(BytesIO(base64.b64decode(encoded_img_b64)))
        decoded_img = np.array(decoded_img)

        # function for storing np array image to .png format
        '''
            im = Image.fromarray(decoded_img)
            im.save("test.png")
        '''
        im = Image.fromarray(decoded_img)
        im.save("./test/test{}.png".format(self.file_cnt))
        self.file_cnt += 1
        return decoded_img
        
        