export default function rdFooter() {
    return {
        replace: true,
        template: 
`<div class="app-footer wrapper b-t bg-light">
    <span class="pull-right">{{app.version}} <a href ui-scroll-to="app" class="m-l-sm text-muted"><i class="fa fa-long-arrow-up"></i></a></span>
    &copy; 2016 Copyright.
  </div>`
    };
}