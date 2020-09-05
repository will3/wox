class Curve {
  intervals: number[] = [-1, 1];
  values: number[] = [-1, 1];

  constructor(intervals?: number[], values?: number[]) {
    if (intervals != null) {
      this.intervals = intervals;
    }

    if (values != null) {
      this.values = values;
    }
  }

  sample(interval: number) {
    if (interval < this.intervals[0]) {
      return this.values[0];
    }

    if (interval > this.intervals[this.intervals.length - 1]) {
      return this.values[this.intervals.length - 1];
    }

    for (let i = 0; i < this.intervals.length - 1; i++) {
      const i1 = this.intervals[i];
      const i2 = this.intervals[i + 1];
      if (interval >= i1 && interval <= i2) {
        const v1 = this.values[i];
        const v2 = this.values[i + 1];

        const r = (interval - i1) / (i2 - i1);

        return v1 * (1 - r) + v2 * r;
      }
    }

    throw new Error("out of range!");
  }
}

export default Curve;
