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
