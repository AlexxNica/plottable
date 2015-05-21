///<reference path="../reference.ts" />

module Plottable {
  export class QuantitativeScale<D> extends Scale<D, number> {
    protected static _DEFAULT_NUM_TICKS = 10;
    public _userSetDomainer = false;
    private _domainer: Domainer = new Domainer();
    private _tickGenerator: Scales.TickGenerators.TickGenerator<D> = (scale: Plottable.QuantitativeScale<D>) => scale.getDefaultTicks();

    protected _getExtent(): D[] {
      return this._domainer.computeDomain(this._getAllExtents(), this);
    }

    /**
     * Retrieves the domain value corresponding to a supplied range value.
     *
     * @param {number} value: A value from the Scale's range.
     * @returns {D} The domain value corresponding to the supplied range value.
     */
    public invert(value: number): D {
      throw new Error("Subclasses should override _invert");
    }

    public getExtentFromDomain(data: D[]) {
      var extent = d3.extent(data);
      if (extent[0] == null || extent[1] == null) {
        return [];
      } else {
        return extent;
      }
    }

    protected _setDomain(values: D[]) {
      var isNaNOrInfinity = (x: any) => x !== x || x === Infinity || x === -Infinity;
      if (isNaNOrInfinity(values[0]) || isNaNOrInfinity(values[1])) {
        Utils.Methods.warn("Warning: QuantitativeScales cannot take NaN or Infinity as a domain value. Ignoring.");
        return;
      }
      super._setDomain(values);
    }

    /**
     * Gets ticks generated by the default algorithm.
     */
    public getDefaultTicks(): D[] {
      throw new Error("Subclasses should override _getDefaultTicks");
    }

    /**
     * Gets a set of tick values spanning the domain.
     *
     * @returns {D[]} The generated ticks.
     */
    public ticks(): D[] {
      return this._tickGenerator(this);
    }

    /**
     * Given a domain, expands its domain onto "nice" values, e.g. whole
     * numbers.
     */
    public _niceDomain(domain: D[], count?: number): D[] {
      throw new Error("Subclasses should override _niceDomain");
    }

    /**
     * Gets a Domainer of a scale. A Domainer is responsible for combining
     * multiple extents into a single domain.
     *
     * @return {Domainer} The scale's current domainer.
     */
    public domainer(): Domainer;
    /**
     * Sets a Domainer of a scale. A Domainer is responsible for combining
     * multiple extents into a single domain.
     *
     * When you set domainer, we assume that you know what you want the domain
     * to look like better that we do. Ensuring that the domain is padded,
     * includes 0, etc., will be the responsability of the new domainer.
     *
     * @param {Domainer} domainer If provided, the new domainer.
     * @return {QuantitativeScale} The calling QuantitativeScale.
     */
    public domainer(domainer: Domainer): QuantitativeScale<D>;
    public domainer(domainer?: Domainer): any {
      if (domainer == null) {
        return this._domainer;
      } else {
        this._domainer = domainer;
        this._userSetDomainer = true;
        this._autoDomainIfAutomaticMode();
        return this;
      }
    }

    public _defaultExtent(): D[] {
      throw new Error("Subclasses should override _defaultExtent");
    }

    /**
     * Gets the tick generator of the QuantitativeScale.
     *
     * @returns {TickGenerator} The current tick generator.
     */
    public tickGenerator(): Scales.TickGenerators.TickGenerator<D>;
    /**
     * Sets a tick generator
     *
     * @param {TickGenerator} generator, the new tick generator.
     * @return {QuantitativeScale} The calling QuantitativeScale.
     */
    public tickGenerator(generator: Scales.TickGenerators.TickGenerator<D>): QuantitativeScale<D>;
    public tickGenerator(generator?: Scales.TickGenerators.TickGenerator<D>): any {
      if (generator == null) {
        return this._tickGenerator;
      } else {
        this._tickGenerator = generator;
        return this;
      }
    }
  }
}
