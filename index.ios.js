import React, {
  AppRegistry,
  Component,
  Text,
  View,
  NavigationExperimental,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from './styles';

const {
  Container: NavigationContainer,
  RootContainer: NavigationRootContainer,
  Reducer: NavigationReducer,
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

const { JumpToAction } = NavigationReducer.TabsReducer;

function createReducer(initialState) {
  return (currentState, action) => {
    switch (action.type) {
      case 'RootContainerInitialAction':
        return initialState;

      case 'push':
        return NavigationStateUtils.push(currentState, {key: action.key});

      case 'back':
      case 'pop':
        return currentState.index > 0 ?
          NavigationStateUtils.pop(currentState) :
          currentState;

      default:
        return currentState;
    }
  };
}

function RowButton(props) {
  return (
    <TouchableHighlight
      style={styles.row}
      underlayColor="#D0D0D0"
      onPress={props.onPress}
    >
      <Text style={styles.buttonText}>{props.text}</Text>
    </TouchableHighlight>
  );
}

const TabSceneContainer = NavigationContainer.create((props) => {
  console.log(props);
  const currentRouteKey = props.tabs[props.index].key;
  return (
    <ScrollView style={styles.tabPage}>
      {
        props.tabs.map((tab, index) => (
          <RowButton
            key={tab.key}
            text={`${currentRouteKey === tab.key ? 'Viewing' : 'Go to'} ${tab.key}`}
            onPress={() => props.onNavigate(JumpToAction(index))}
          />
        ))
      }
    </ScrollView>
  );
});

const TabBar = NavigationContainer.create((props) => {
  return (
    <View style={styles.tabBar}>
      {
        props.tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              style={styles.tabButton}
              key={tab.key}
              onPress={() => {
                props.onNavigate(JumpToAction(index));
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  props.index === index && styles.selectedTabButtonText,
                ]}
              >
                {tab.key}
              </Text>
            </TouchableOpacity>
          );
        })
      }
    </View>
  );
});


const TabsReducer = NavigationReducer.TabsReducer({
  tabReducers: [
    (lastRoute) => lastRoute || {key: 'one'},
    (lastRoute) => lastRoute || {key: 'two'},
    (lastRoute) => lastRoute || {key: 'three'},
  ],
});


function AppRoot(props) {
  return (
    <NavigationRootContainer
      reducer={TabsReducer}
      renderNavigation={(navigationState) => {
        if (!navigationState) { return null; }
        return (
          <View style={styles.topView}>
            <TabSceneContainer
              tabs={navigationState.children}
              index={navigationState.index}
            />
            <TabBar
              tabs={navigationState.children}
              index={navigationState.index}
            />
          </View>
        );
      }}
    />
  );
}


AppRegistry.registerComponent('NavigatorExperimental', () => AppRoot);
