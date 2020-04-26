
class CreateOrUpdateExampleItems {
    static readonly type = '[Example] CreateOrUpdateItems]';
    constructor(public readonly items: any[]) {}
  }
class CreateOrUpdateExampleItem {
    static readonly type = '[Example] CreateOrUpdateItem]';
    constructor(public readonly item: Item) {}
  }

class CreateOrUpdateExampleItemName {
    static readonly type = '[Example] CreateOrUpdateName]';
    constructor(public readonly name: string) {}
  }
class CreateOrUpdateExampleItemNested {
    static readonly type = '[Example] CreateOrUpdateNested]';
    constructor(public readonly nested: Nested) {}
  }

class CreateOrUpdateExampleNestedKey {
    static readonly type = '[Example] CreateOrUpdateKey]';
    constructor(public readonly key: string) {}
  }
class CreateOrUpdateExampleSomeString {
    static readonly type = '[Example] CreateOrUpdateSomeString]';
    constructor(public readonly someString: string) {}
  }
class CreateOrUpdateExampleStringArray {
    static readonly type = '[Example] CreateOrUpdateStringArray]';
    constructor(public readonly stringArray: any[]) {}
  }
class CreateOrUpdateExampleANumber {
    static readonly type = '[Example] CreateOrUpdateANumber]';
    constructor(public readonly aNumber: number) {}
  }
class CreateOrUpdateExampleBool {
    static readonly type = '[Example] CreateOrUpdateBool]';
    constructor(public readonly bool: boolean) {}
  }