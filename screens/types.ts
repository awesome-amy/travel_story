import { Entry, Place } from '../types';

export type RootStackParamList = {
  Home: undefined;
  EntryEditor: { entry?: Entry } | undefined;
  Places: undefined;
  PlaceDetail: { place: Place };
  EntryDetail: { entry: Entry };
  Map: undefined;
  Drafts: undefined;
  Trash: undefined;
};

