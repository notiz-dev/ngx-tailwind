export interface ExampleStateModel {
    items:       Item[];
    item:        Item;
    someString:  string;
    stringArray: string[];
    aNumber:     number;
    bool:        boolean;
}

export interface Item {
    name:   string;
    nested: Nested | null;
}

export interface Nested {
    key: string;
}
