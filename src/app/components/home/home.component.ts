import { Component, isDevMode, OnInit } from '@angular/core';
import { MoonbirdsService } from 'src/app/services/moonbirds.service';

const MetadataUrl = isDevMode() ? 'metadata/' : "https://xr5jdctc70.execute-api.us-east-2.amazonaws.com/prod/";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public inputText: string = '';
  public tokenID: any;
  public moonbirdImg: string = '';
  public notValidId: boolean = false;
  public isNudebird: boolean = false;
  public notNudebirdMessage: string = 'Not Nudebird';

  constructor(private api: MoonbirdsService) {}

  // TODO: read from the in-chain contract for custom backgrounds

  ngOnInit(): void {
    console.log('COOL TOKEN IDs:');
    console.log('Skelly: #9381');
    console.log('Robot: #3231');
    console.log('Jade: #5079');
    console.log('Special Eyes: #9999');
    console.log('Kevin Rose: #6981');
  }

  public getMoonbirdMetadata(tokenId: string) {
    this.notValidId = false;
    if (!this.isNumericInRange(tokenId)) {
      console.log('Not a valid token ID');
      this.notValidId = true;
      return;
    }
    const url = MetadataUrl + tokenId;
    this.api.getMoonbirdsMetadata(url).subscribe(
      (data) => {
        this.moonbirdImg = data.image;
        this.tokenID = data.name;
        this.inputText = this.tokenID.substring(1);
        this.notNudebirdMessage = this.checkDisqualifyingTrait(data);
      },
      (err) => {
        console.log(err);
      }
    );
    this.isMoonbirdNudebird(tokenId);
  }

  public isMoonbirdNudebird(tokenId: string) {
    this.notValidId = false;
    if (!this.isNumericInRange(tokenId)) {
      console.log('Not a valid token ID');
      this.notValidId = true;
      return;
    }

    this.api.getNudebirdsData('/assets/nudebirds_token_ids.txt').subscribe(
      (data: any) => {
        data = data.split(', ');
        this.isNudebird = data.includes(tokenId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkDisqualifyingTrait(metadata: any) {
    const attributes = metadata.attributes.map((attr: any) => attr.value);
    const funny = [
      "You've more than 5 traits",
      "I'm afraid you're a bit too fancy for Nudebirds",
      'Sorry, no clothes allowed',
      "I'm sorry, but our club has a strict dress code",
      "You're too clothed and too valuable",
    ];
    const rareEyes = ['Rainbow', 'Heart', 'Fire', 'Moon', 'Diamond'];
    const rareBodies = ['Robot', 'Skeleton', 'Golden', 'Ruby Skeleton'];
    const superRareBodies = ['Cosmic', 'Glitch', 'Enlightened', 'Jade'];

    if (attributes.length === 6) {
      return 'Not Nudebird; ' + this.pickRandomString(funny);
    }
    if (rareEyes.includes(attributes[0])) {
      return `Not Nudebird; You've rare ${attributes[0]} eyes`;
    }
    if (metadata.attributes[0].trait_type === 'Eyewear') {
      return "Not Nudebird; You're wearing some cool Eyewear, try taking it off?";
    }
    if (rareBodies.includes(attributes[1])) {
      return attributes[1] === 'Skeleton' || attributes[1] === 'Ruby Skeleton'
        ? 'Not Nudebird; Dead is Dead 💀'
        : 'Not Nudebird; A little too shiny';
    }
    if (superRareBodies.includes(attributes[1])) {
      return "You're a GOD Not a Nudebird";
    }
    return attributes.length > 6
      ? "Not Nudebird; So many traits wow, you're very cool"
      : 'Not Nudebird';
    // if (metadata.attributes.length > 6) {
    //   this.notNudebirdMessage =
    //     "Not Nudebird; So many traits wow, you're very cool";
    // } else if (metadata.attributes.length > 5) {
    //   this.notNudebirdMessage = 'Not Nudebird; ' + this.pickRandomString(funny);
    // } else if (rareEyes.includes(metadata.attributes[0].value)) {
    //   this.notNudebirdMessage =
    //     "Not Nudebird; You've rare " + metadata.attributes[0].value + ' eyes';
    // } else if (metadata.attributes[0].trait_type === 'Eyewear') {
    //   this.notNudebirdMessage =
    //     "Not Nudebird; You're wearing some cool Eyewear, try taking it off?";
    // } else if (rareBodies.includes(metadata.attributes[1].value)) {
    //   if (
    //     metadata.attributes[1].value === 'Skeleton' ||
    //     metadata.attributes[1].value === 'Ruby Skeleton'
    //   ) {
    //     this.notNudebirdMessage = 'Not Nudebird; Dead is Dead 💀';
    //   } else {
    //     this.notNudebirdMessage = 'Not Nudebird; A little too shiny';
    //   }
    // } else if (superRareBodies.includes(metadata.attributes[1].value)) {
    //   this.notNudebirdMessage = "You're a GOD Not a Nudebird";
    // } else {
    //   this.notNudebirdMessage = 'Not Nudebird';
    // }
  }

  pickRandomString(strArray: string[]): string {
    const randomIndex = Math.floor(Math.random() * strArray.length);
    return strArray[randomIndex];
  }

  submit() {
    this.getMoonbirdMetadata(this.inputText);
  }

  prevButtonClicked() {
    this.getMoonbirdMetadata(this.addOrSubtract(this.inputText, 1, false));
  }

  nextButtonClicked() {
    this.getMoonbirdMetadata(this.addOrSubtract(this.inputText, 1, true));
  }

  isNumericInRange(str: string): boolean {
    const num = Number(str);
    if (isNaN(num) || !Number.isInteger(num)) {
      // Not a number
      return false;
    }
    if (num < 0 || num >= 10000) {
      // Number is not within range
      return false;
    }
    // Number is numeric and within range
    return true;
  }

  addOrSubtract(
    numString: string,
    numToAddOrSubtract: number,
    isAddition: boolean
  ): string {
    const num = parseInt(numString);
    const result = isAddition
      ? num + numToAddOrSubtract
      : num - numToAddOrSubtract;
    return result.toString();
  }
}
