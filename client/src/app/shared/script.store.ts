interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    {name: 'googledistance', src: 'https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBe8qhHfBKRdeOK0iWAQiYtQWStEyQOXC4'},
    {name: 'googlemaps', src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBe8qhHfBKRdeOK0iWAQiYtQWStEyQOXC4&libraries=places'}

];