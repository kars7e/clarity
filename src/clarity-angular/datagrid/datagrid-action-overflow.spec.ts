/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component} from "@angular/core";
import {TestContext} from "./helpers.spec";
import {DatagridActionOverflow} from "./datagrid-action-overflow";
import {RowActionService} from "./providers/row-action-service";
import {TestBed} from "@angular/core/testing";

export default function(): void {
    describe("DatagridActionOverflow component", function() {
        let context: TestContext<DatagridActionOverflow, SimpleTest>;
        let rowActionServiceProvider: RowActionService;
        let toggle: HTMLElement;

        beforeEach(function() {
            context = this.create(DatagridActionOverflow, SimpleTest, [RowActionService]);
            rowActionServiceProvider = TestBed.get(RowActionService);
            toggle = context.clarityElement.querySelector("clr-icon");
        });

        it("offers two-way binding on clrDgActionOverflowOpen", function() {
            context.clarityDirective.open = true;
            context.detectChanges();
            expect(context.testComponent.open).toBe(true);
            context.testComponent.open = false;
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(false);
        });

        it("projects menu content when open", function() {
            context.clarityDirective.open = true;
            context.detectChanges();
            expect(context.clarityElement.textContent.trim()).toMatch("Hello world");
        });

        it("opens and closes the menu when the toggle is clicked", function() {
            expect(context.clarityDirective.open).toBe(false);
            toggle.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(true);
            toggle.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(false);
        });

        it("closes the menu when clicked outside of the host", () => {
            let outsideDiv: HTMLElement = context.testElement.querySelector(".outside-click-test");

            // should be closed initially
            expect(context.clarityDirective.open).toBe(false);

            // should open when the ellipses icon is clicked
            toggle.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(true);

            // should close when an area outside of the component is clicked
            outsideDiv.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(false);
        });

        it("doesn't close the menu when an action menu item container is clicked", () => {
            // should open when the ellipses icon is clicked
            toggle.click();
            context.detectChanges();

            let actionOverflowMenu: HTMLElement = context.clarityElement.querySelector(".datagrid-action-overflow");
            actionOverflowMenu.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(true);
        });

        it("closes the menu when an action menu item is clicked", () => {
            // should open when the ellipses icon is clicked
            toggle.click();
            context.detectChanges();

            let actionItem: HTMLElement = context.clarityElement.querySelector(".action-item");
            actionItem.click();
            context.detectChanges();
            expect(context.clarityDirective.open).toBe(false);
        });

        it("registers to the RowActionServiceProvider provider", function() {
            expect(rowActionServiceProvider.actionableCount).toEqual(1);
        });

        it("unregisters from the RowActionServiceProvider provider when destroyed", function() {
            context.clarityDirective.ngOnDestroy();
            expect(rowActionServiceProvider.actionableCount).toEqual(0);
        });
    });
}

@Component({
    template: `
        <div class="outside-click-test">
            This is an area outside of the action overflow
        </div>
        <clr-dg-action-overflow [(clrDgActionOverflowOpen)]="open">
            <button class="action-item">Hello world</button>
        </clr-dg-action-overflow>`
})
class SimpleTest {
    open: boolean;
}