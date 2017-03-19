

export class Temperature {
    constructor(
        public value: number,
        public unitLabel: string,
        ){}
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

export class CurrentConditions {
  constructor(
    public metric: Temperature,
    public imperial: Temperature,
    public epochDateTime: Date,
    public iconIndex: number) { }


    resourceFile = () =>{
        if (!this.iconIndex)
            return "";

        return zeroPad(this.iconIndex,2) + "-s.png";
    } 
}

