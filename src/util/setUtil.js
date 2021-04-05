class SetUtil {
    toggle(set, item) {
        if (set.has(item)) {
            set.delete(item);
        } else {
            set.add(item);
        }
    }

    immutableToggle(set, item) {
        const newSet = new Set(set);
        this.toggle(newSet, item);
        return newSet;
    }

    intersect(set1, set2) {
        return new Set([...set1].filter(elem => set2.has(elem)));
    }

    union(set1, set2) {
        return new Set([...set1, ...set2]);
    }
}

export default new SetUtil();