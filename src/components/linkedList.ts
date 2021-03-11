interface LinkedListNode<T> {
    value: T;
    prev: LinkedListNode<T> | null;
    next: LinkedListNode<T> | null;
};

interface LinkedList<T> {
    head: LinkedListNode<T> | null;
    foot: LinkedListNode<T> | null;

    readonly length: number;

    at(index: number): LinkedListNode<T> | null;

    insert(index: number, value: T): void;
    unshift(value: T): void;
    push(value: T): void;
    
    remove(index: number): void;
    shift(): void;
    pop(): void;
};

class GenericLinkedListNode<T> implements LinkedListNode<T> {
    public prev: LinkedListNode<T> | null = null;
    public next: LinkedListNode<T> | null = null;

    constructor(public value: T) {
    }
}

class GenericLinkedList<T> implements LinkedList<T> {
    public head: LinkedListNode<T> | null = null;
    public foot: LinkedListNode<T> | null = null;
    
    private count = 0;

    public get length() {
        return this.count;
    }

    private get medianIndex() {
        return this.length / 2;
    }

    private checkIndex(index: number): boolean {
        if (index < 0) {
            throw new Error(`Index must be positive: ${index}`);
        }

        if (index >= this.length) {
            console.warn(`index ${index} out of bounds.`);
            return false;
        }

        return true;
    }
    
    public at(index: number) {
        if (!this.checkIndex(index)) {
            return null;
        }

        let isForward = (index < this.medianIndex);
        let currentNode = isForward ? this.head : this.foot;
        let currentIndex = isForward ? 0 : (this.length - 1);

        while (currentIndex !== index) {
            currentNode = (isForward
                ? currentNode?.next
                : currentNode?.prev
            ) as LinkedListNode<T>;
            currentIndex += isForward ? 1 : -1;
        }
        
        return currentNode;
    }

    public insert(index: number, value: T) {
        
    }

    public unshift(value: T) {
        
    }

    public push(value: T) {

    }

    public remove(index: number) {

    }

    public shift() {

    }

    public pop() {

    }
}
