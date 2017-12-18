import {
    Inject,
    Injector,
    Injectable,
    TemplateRef,
    ViewRef,
    ElementRef,
    EmbeddedViewRef,
    ViewContainerRef,
    Renderer2,
    NgZone,
    Host,
    SkipSelf,
    ComponentRef,
    ComponentFactory,
    ComponentFactoryResolver
} from '@angular/core';
import { ConnectionPosition, HorizontalConnectionPos, VerticalConnectionPos, ConnectionPositionPair, Placement } from '../util/position';
import { PositionStrategy } from '../util/connected-position.strategy';
// import { OverlayPositionService } from './overlay-position.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { auditTime } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { ViewportRuler } from './scroll-strategy';

export class ContentRef {
    constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) { }
}

@Injectable()
export class DynamicComponentService<T> {
    // private _windowFactory: ComponentFactory<T>;
    private componentRef: ComponentRef<T> | null;
    private overlayComponent: any;
    private _contentRef: ContentRef | null;
    private positionStrategy: PositionStrategy;
    private originElement: ElementRef;
    originPos: ConnectionPosition;
    overlayPos: ConnectionPosition;
    placement: string;

    /** Subscription to viewport resize events. */
    _resizeSubscription = Subscription.EMPTY;

    constructor(
        private _injector: Injector,
        private _renderer: Renderer2,
        private _viewContainerRef: ViewContainerRef,
        // // private overlayPositionService: OverlayPositionService,
        private _componentFactoryResolver: ComponentFactoryResolver) {
    }

    createDynamicComponent(
        type: any,
        content: string | TemplateRef<any>,
        hostDomElement: Element,
        context?: any): ComponentRef<T> {

        let windowFactory: ComponentFactory<T>;
        if (!this.componentRef) {
            this._contentRef = this._getContentRef(content, context);
            windowFactory = this._componentFactoryResolver.resolveComponentFactory<T>(type);
            this.componentRef =
                this._viewContainerRef.createComponent(windowFactory, 0, this._injector, this._contentRef.nodes);
        }

        let overlayRootNode = this.getComponentRootNode(this.componentRef);
        hostDomElement.appendChild(overlayRootNode);

        return this.componentRef;
    }

    close() {
        if (this.componentRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this.componentRef.hostView));
            this.componentRef = null;

            let viewRef = this._contentRef!.viewRef;
            if (viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
                this._contentRef = null;
            }
        }
        this._resizeSubscription.unsubscribe();
    }

    private _getContentRef(content?: string | TemplateRef<any>, context?: any): ContentRef {
        if (!content) {
            return new ContentRef([]);
        } else if (content instanceof TemplateRef) {
            const viewRef = this._viewContainerRef.createEmbeddedView(<TemplateRef<T>>content, context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        } else {
            return new ContentRef([[this._renderer.createText(`${content}`)]]);
        }
    }

    getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}
