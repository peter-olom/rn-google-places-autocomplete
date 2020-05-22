import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import 'react-native-get-random-values';
import * as Random from 'expo-random';
import { nanoid as bareNanoid } from 'nanoid'
import { nanoid as expoNanoid } from 'nanoid/async/index'
import queryAddr from './query';
import Places, { suggestionsStyle, decorateTextFormat } from './places';
import { GoogleAutoCompleteResult, prediction, GoogleParameters } from '../types';

export interface AutoComplete {
  platformType: 'bare' | 'expo';
  placeholder?: string;
  value?: string;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  fetchOffset?: number;
  fetchActivity?: JSX.Element | boolean;
  predictionOptions?: {
    style?: suggestionsStyle,
    icon?: JSX.Element,
    highlight?: decorateTextFormat
  };
  googleParameters: GoogleParameters
  onSelectAddress?(address: prediction): void;
  onFetching?(status: boolean): void;
  onQueryError?(res: GoogleAutoCompleteResult): void;
}

function AutoComplete({
  platformType,
  placeholder,
  value,
  inputContainerStyle,
  inputStyle,
  fetchOffset,
  fetchActivity,
  predictionOptions,
  googleParameters,
  onSelectAddress,
  onFetching,
  onQueryError,
}: AutoComplete) 
{
  const [addr, setAddr] = useState<string>("");
  const [places, setPlaces] = useState<Array<prediction>>([]);
  const [sessionToken, setSessionToken] = useState('');
  const [fetching, setFetching] = useState<boolean>(false);

  const offset = fetchOffset || 3;
  
  useEffect(() => {
    if(value != undefined && value != "") {
      setAddr(value);
    }
  }, [value]);

  const setSelectedAddr = (value: prediction) => {
    setAddr(value.description);
    if(onSelectAddress != undefined){
      onSelectAddress(value);
    }
  }

  const updateFetching = (status: boolean) => {
    setFetching(status);
    if(onFetching) {
      onFetching(status);
    }
  }

  const createSessionToken = async () => {
    if (platformType == 'expo') {
      return await expoNanoid();
    }
    
    return bareNanoid();
  }
  const controller = new AbortController();
  const signal = controller.signal;

  return (
    <View style={styles.mainContent}>
      <View style={[styles.autocompleteContainer, inputContainerStyle]}>
        <TextInput
          spellCheck={false}
          autoCorrect={false}
          placeholder={placeholder}
          value={addr}
          onFocus={async () => {
            // create session token here
            const sess = await createSessionToken();
            setSessionToken(sess);
          }}
          onBlur={() => {
            // discard the session token
            setSessionToken('');
          }}
          onKeyPress={(e) => {
            // more reliable for clearing predictions and halting fetch
            const { key } = e.nativeEvent;
            if(key == 'Backspace' && addr.length <= 1) {
              controller.abort();
              setPlaces([]);
            }
          }}
          onChangeText={async (text) => {
            setAddr(text);
            if (text.length >= offset) {
              try {
                const res = await queryAddr(
                  text, 
                  sessionToken,
                  googleParameters, 
                  signal, 
                  updateFetching,
                  onQueryError,
                );
                setPlaces(res.predictions);
              } catch (_err) {
                // this will only every happen when fetching fails
                console.warn(_err);
              }
            }
          }}
          style={[styles.autocompleteInput, inputStyle]}
        />
        {fetchActivity && fetching ? 
          typeof(fetchActivity) == 'boolean' ?
            <View style={styles.loaderStyle}>
              <ActivityIndicator size={20} animating={true} />
            </View>
            : fetchActivity
          :<></>
        }
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
  )
}

export default AutoComplete;

// Default stylings
const styles = StyleSheet.create({
  mainContent: {
    flex: 1
  },
  autocompleteContainer: {
    marginTop: 10,
    backgroundColor: '#fff'
  },
  autocompleteInput: {
    height: 50,
    backgroundColor: '#f3f3f3',
    color: '#121212',
    paddingHorizontal: 10,
    borderRadius: 10
  },
  loaderStyle: {
    position: 'absolute',
    right: 10,
    top: 16
  }
})