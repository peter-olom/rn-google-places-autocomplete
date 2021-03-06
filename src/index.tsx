import * as React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Text,
} from 'react-native';
import queryAddr from './query';
import Places, { suggestionsStyle, decorateTextFormat } from './places';
import {
  GoogleAutocompleteResult,
  prediction,
  GoogleParameters,
  TokenGenerator,
} from './types';
import TouchableWrapper from './TouchableWrapper';

export interface PlacesAutocompleteProps {
  tokenGenerator?: TokenGenerator;
  placeholder?: string;
  value?: string;
  autocompleteContainer?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  fetchOffset?: number;
  fetchActivity?: JSX.Element | boolean;
  predictionOptions?: {
    style?: suggestionsStyle;
    icon?: JSX.Element;
    highlight?: decorateTextFormat;
  };
  googleParameters: GoogleParameters;
  onSelectAddress?(address: prediction): void;
  onFetching?(status: boolean): void;
  onClearText?(): void;
  onQueryError?(res: GoogleAutocompleteResult): void;
}

function PlacesAutocomplete({
  tokenGenerator,
  placeholder,
  value,
  autocompleteContainer,
  inputContainerStyle,
  inputStyle,
  fetchOffset,
  fetchActivity,
  predictionOptions,
  googleParameters,
  onSelectAddress,
  onFetching,
  onClearText,
  onQueryError,
}: PlacesAutocompleteProps) {
  const [addr, setAddr] = React.useState<string>('');
  const [places, setPlaces] = React.useState<Array<prediction>>([]);
  const [sessionToken, setSessionToken] = React.useState<string>();
  const [fetching, setFetching] = React.useState<boolean>(false);
  const [blurred, setBlurred] = React.useState<boolean>(true);

  const offset = fetchOffset || 3;

  React.useEffect(() => {
    if (value != undefined && value != '') {
      setAddr(value);
    }
  }, [value]);

  const setSelectedAddr = (value: prediction) => {
    setAddr(value.description);
    if (onSelectAddress != undefined) {
      onSelectAddress(value);
    }
  };

  const updateFetching = (status: boolean) => {
    setFetching(status);
    if (onFetching) {
      onFetching(status);
    }
  };

  const controller = new AbortController();
  const signal = controller.signal;

  return (
    <View style={[autocompleteContainer]}>
      <View style={[styles.autocompleteContainer, inputContainerStyle]}>
        <TextInput
          spellCheck={false}
          autoCorrect={false}
          placeholder={placeholder}
          value={addr}
          onFocus={async () => {
            setBlurred(false);
            // create session token here
            if (tokenGenerator) {
              try {
                const sess = await tokenGenerator();
                setSessionToken(sess);
              } catch (error) {
                // fail silently
                console.log('Token generator error: ', error);
              }
            }
          }}
          onBlur={() => {
            setBlurred(true);
            // discard the session token
            setSessionToken('');
            setPlaces([]);
          }}
          onKeyPress={e => {
            // more reliable for clearing predictions and halting fetch
            const { key } = e.nativeEvent;
            if (key == 'Backspace' && addr.length <= 1) {
              controller.abort();
              setPlaces([]);
            }
          }}
          onChangeText={async text => {
            setAddr(text);
            if (text.length >= offset) {
              try {
                const res = await queryAddr(
                  text,
                  googleParameters,
                  signal,
                  sessionToken,
                  updateFetching,
                  onQueryError
                );
                setPlaces(res.predictions);
              } catch (_err) {
                // this will only ever happen when fetching fails
                console.warn(_err);
              }
            }
          }}
          style={[styles.autocompleteInput, inputStyle]}
        />
        {fetchActivity && fetching ? (
          typeof fetchActivity == 'boolean' ? (
            <View style={styles.loaderStyle}>
              <ActivityIndicator
                size={20}
                animating={true}
                style={{ width: 32 }}
              />
            </View>
          ) : (
            fetchActivity
          )
        ) : (
          <></>
        )}
        {!fetching && !blurred ? (
          <View style={styles.loaderStyle}>
            <TouchableWrapper
              style={{ height: 32, width: 32, borderRadius: 16 }}
              onPress={() => {
                setAddr('');
                if (onClearText) onClearText();
              }}
            >
              <Text
                style={{ fontSize: 24, color: 'grey', textAlign: 'center' }}
              >
                &times;
              </Text>
            </TouchableWrapper>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View style={{ position: 'relative', flex: 1 }}>
        <Places
          data={places}
          setValue={setSelectedAddr}
          suggestionsStyle={predictionOptions?.style}
          icon={predictionOptions?.icon}
          highlight={predictionOptions?.highlight}
        />
      </View>
    </View>
  );
}

export default PlacesAutocomplete;

// Default stylings
const styles = StyleSheet.create({
  autocompleteContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  autocompleteInput: {
    height: 50,
    backgroundColor: '#f3f3f3',
    color: '#121212',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  loaderStyle: {
    position: 'absolute',
    height: '100%',
    right: 5,
    justifyContent: 'center',
    backgroundColor: '#00000000',
  },
});
