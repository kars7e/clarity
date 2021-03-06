/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Observable} from "rxjs/Observable";

export interface Filter<T> {
    isActive(): boolean;

    accepts(item: T): boolean;

    changes: Observable<any>;
}