```powershell
ng new my-first-app
ng install bootstrap@3
```



#### [NgModules](https://angular.io/guide/ngmodules)

**NgModules** configure the injector and the compiler and help organize related things together.

An NgModule is a class marked by the `@NgModule` decorator. `@NgModule` takes a metadata object that describes how to compile a component's template and how to create an injector at runtime. It identifies the module's own components, directives, and pipes, making some of them public, through the `exports` property, so that external components can use them. `@NgModule` can also add service providers to the application dependency injectors.

Modules can be loaded eagerly when the application starts or lazy loaded asynchronously by the router.

NgModule metadata does the following:

- Declares which components, directives, and pipes belong to the module.
- Makes some of those components, directives, and pipes public so that other module's component templates can use them.
- Imports other modules with the components, directives, and pipes that components in the current module need.
- Provides services that other application components can use.

```typescript
// imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// @NgModule decorator with its metadata
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```



#### Component Selector

````typescript
// server.component.ts
@Component({
  selector: '[app-server]',
  template: `
	<p>server works!</p>
  `
})

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
	<h3>I'm in the AppComponent!</h3>
    <div app-server></div>
  `
})
````



#### [Data Binding](https://angular.io/guide/binding-syntax)

Data binding automatically keeps your page up-to-date based on your application's state. The target of a data binding can be a property, an event, or an attribute name.

Angular provides three categories of data binding according to the direction of data flow:

- From the source to view
- From view to source
- In a two way sequence of view to source to view

| Type                                         | Syntax                                                       | Category                                |
| :------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------- |
| Interpolation Property Attribute Class Style | `{{expression}} [target]="expression" bind-target="expression"` | One-way from data source to view target |
| Event                                        | `(target)="statement" on-target="statement"`                 | One-way from view target to data source |
| Two-way                                      | `[(target)]="expression" bindon-target="expression"`         | Two-way                                 |



| Type      | Target                                                 | Examples                                                     |
| :-------- | :----------------------------------------------------- | :----------------------------------------------------------- |
| Property  | Element property Component property Directive property | `src`, `hero`, and `ngClass` in the following:`<img [src]="heroImageUrl"> <app-hero-detail [hero]="currentHero"></app-hero-detail> <div [ngClass]="{'special': isSpecial}"></div>` |
| Event     | Element event Component event Directive event          | `click`, `deleteRequest`, and `myClick` in the following:`<button (click)="onSave()">Save</button> <app-hero-detail (deleteRequest)="deleteHero()"></app-hero-detail> <div (myClick)="clicked=$event" clickable>click me</div>` |
| Two-way   | Event and property                                     | `<input [(ngModel)]="name">`                                 |
| Attribute | Attribute (the exception)                              | `<button [attr.aria-label]="help">help</button>`             |
| Class     | `class` property                                       | `<div [class.special]="isSpecial">Special</div>`             |
| Style     | `style` property                                       | <button [style.color]="isSpecial ? 'red' : 'green'">`        |



##### Property Binding

````typescript
@Component({
  template: `
	<button class="btn btn-primary" [disabled]="!allowNewServer">Add Server</button>
 	<p [innerText]="allowNewServer"></p>
 `,
})
export class ServerComponent implements OnInit {
  allowNewServer = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }
}
````

<img align="left" src="https://1.bp.blogspot.com/-EpG34MTC6uA/YTE2yHTJxKI/AAAAAAAADRY/2Q4sq5dbYV0h6g2u9RJaUQdeV6MpZ2UjQCLcBGAsYHQ/s0/20210902233943224.gif">



##### [Event Binding](https://angular.io/guide/event-binding-concepts)

````typescript
@Component({
  template: `
	<button class="btn btn-primary" (click)="onCreateServer()">Add Server</button>
	<p>{{serverCreationStatus}}</p>
 `,
})
export class ServersComponent {
  serverCreationStatus = 'No server was created!';

  onCreateServer() {
    this.serverCreationStatus = 'Server was created.';
  }
}
````

<img align="left" src="https://1.bp.blogspot.com/-PMmtkwBDUi4/YTE7gZAzYHI/AAAAAAAADRg/s1e-aXt_gOUAC8g61RpRKaezFzCQwTf4ACLcBGAsYHQ/s0/20210902235943770.gif">



###### Handling events

A common way to handle events is to pass the event object, `$event`, to the method handling the event. The `$event` object often contains information the method needs, such as a user's name or an image URL.

The target event determines the shape of the `$event` object. If the target event is a native DOM element event, then `$event` is a [DOM event object](https://developer.mozilla.org/en-US/docs/Web/Events), with properties such as `target` and `target.value`.

In the following example the code sets the `<input>` `value` property by binding to the `name` property.

````typescript
@Component({
  template: `
	<input [value]="currentItem.name"
       (input)="currentItem.name=getValue($event)">
 `,
})
export class ServersComponent {
  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
````



````typescript
@Component({
  template: `
	<label>Server Name</label>
	<input type="text" class="form-control" (input)="onUpdateServerName($event)">
	<p>{{serverName}}</p>
 `,
})
export class ServersComponent {
  serverName = '';

  onUpdateServerName(event: Event) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
````

<img align="left" src="https://1.bp.blogspot.com/-bSrVXr7S8CE/YTE_qURRqwI/AAAAAAAADRo/kz6V9pHzolMY1N5oVH5qzHzw0LG99QIhgCLcBGAsYHQ/s0/20210903001720112.gif">



##### Two Way Data Binding

###### [[(ngModel)]](https://angular.io/api/forms/NgModel)

Creates a `FormControl` instance from a domain model and binds it to a form control element.

The `FormControl` instance tracks the value, user interaction, and validation status of the control and keeps the view synced with the model. If used within a parent form, the directive also registers itself with the form as a child control.

This directive is used by itself or as part of a larger form. Use the `ngModel` selector to activate it.

It accepts a domain model as an optional `Input`. If you have a one-way binding to `ngModel` with `[]` syntax, changing the domain model's value in the component class sets the value in the view. If you have a two-way binding with `[()]` syntax, the value in the UI always syncs back to the domain model in your class.


```typescript
@Component({
  template: `
    <input type="text" [(ngModel)]="name" #ctrl="ngModel" required>
	<input type="text" [ngModel]="name">
	
	<p>{{name}}</p>
	<p>Valid: {{ ctrl.valid }}</p>
	
	<button (click)="setValue()">Set value</button>
  `,
})
export class ServerComponent {
  name: string = '';

  setValue() {
    this.name = 'Hudayfee';
  }
}
```

<img align="left" src="https://1.bp.blogspot.com/-KpF5TLlMaU0/YTEd5qg8MMI/AAAAAAAADRQ/UTyV0TCWmpAQNHRKOc2iQ_ngufpJVNoKwCLcBGAsYHQ/s0/20210902215012325.gif">



##### Directives

###### [NgIf](https://angular.io/api/common/NgIf)

````typescript
@Component({
  template: `
	<p *ngIf="serverCreated; else noServer">Server was created, server name is {{serverName}}</p>
	<ng-template #noServer>
  		<p>No server was created!</p>
	</ng-template>
 	
	<button class="btn btn-primary" (click)="onCreateServer()">Add Server</button>
 `,
})
export class ServerComponent {
  serverName = '';
  serverCreated = false;

  onCreateServer() {
    this.serverCreated = true;
    this.serverCreationStatus = 'Server was created.';
  }
}
````



````typescript
<div *ngIf="condition; then thenBlock else elseBlock"></div>
<ng-template #thenBlock>Content to render when condition is true.</ng-template>
<ng-template #elseBlock>Content to render when condition is false.</ng-template>


<ng-template [ngIf]="heroes" [ngIfElse]="loading">
 <div class="hero-list">
  ...
 </div>
</ng-template>

<ng-template #loading>
 <div>Loading...</div>
</ng-template>
````



###### [NgStyle](https://angular.io/api/common/NgStyle)

Set the font of the containing element to the result of an expression.

```
<some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
```

Set the width of the containing element to a pixel value returned by an expression.

```
<some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
```

Set a collection of style values using an expression that returns key-value pairs.

```
<some-element [ngStyle]="objExp">...</some-element>
```



````typescript
@Component({
  template: `
	<p [ngStyle]="{backgroundColor: getColor()}">Server is {{getServerStatus()}}</p>
 `,
})
export class ServerComponent {
  serverStatus: string = 'offline';

  constructor() {
    this.serverStatus = Math.random() > 0.5 ? 'online' : 'offline';
  }

  getServerStatus() {
    return this.serverStatus;
  }

  getColor() {
    return this.serverStatus === 'online' ? 'green' : 'red';
  }
}
````



###### [NgClass](https://angular.io/api/common/NgClass)

The CSS classes are updated as follows, depending on the type of the expression evaluation:

- `string` - the CSS classes listed in the string (space delimited) are added,
- `Array` - the CSS classes declared as Array elements are added,
- `Object` - keys are CSS classes that get added when the expression given in the value evaluates to a truthy value, otherwise they are removed.

```typescript
<some-element [ngClass]="'first second'">...</some-element>

<some-element [ngClass]="['first', 'second']">...</some-element>

<some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>

<some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>

<some-element [ngClass]="{'class1 class2 class3' : true}">...</some-element>
```



````typescript
@Component({
  template: `
	<p [ngStyle]="{backgroundColor: getColor()}" [ngClass]="{online: serverStatus === 'online'}">Server is {{getServerStatus()}}</p>
 `,
  styles: [`
    .online {
      color: white;
    }
  `]
})
export class ServerComponent {
  serverStatus: string = 'offline';

  constructor() {
    this.serverStatus = Math.random() > 0.5 ? 'online' : 'offline';
  }

  getServerStatus() {
    return this.serverStatus;
  }

  getColor() {
    return this.serverStatus === 'online' ? 'green' : 'red';
  }
}
````



###### [NgForOf](https://angular.io/api/common/NgForOf)

````typescript
@Component({
  template: `
	<p *ngFor="let server of servers">{{server}}</p>
 `
})
export class ServerComponent {
  servers = ['TestServer', 'TestServer 2'];
}
````

