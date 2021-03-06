/*
	* by 양천일염
	* https://github.com/kibkibe/roll20_api_scripts
	* 201115
    
	[ 소개 ]
	캐릭터가 시트상에서 스테이터스를 변경하면 해당 내역을 채팅로그에 표시해주는 스크립트입니다.
	변경사항을 다른 참가자에게 바로바로 알려줌과 동시에 로그에 진행기록을 남길 수 있도록 도와줍니다.

	[ 사용법 ]
  
  	준비1. 스크립트 적용
  	1. 세션방의 대문에 해당하는 페이지에서 [설정]->[API 스크립트]를 선택해 스크립트 수정 페이지로 들어갑니다. (PRO 계정에서만 이 메뉴가 보입니다.)
  	2. New Script에 아래의 코드들을 복사해 붙여놓습니다.
  	3. 사용할 룰에 맞춰 예시 check_list 중 하나만 남기고 삭제하거나,
  	   아래 설명을 참고해 변경을 체크할 수치들의 목록을 check_list로 작성합니다.

            * 체크리스트에 포함되어야 할 데이터
            - attr: 캐릭터 시트상에서 해당 속성을 저장하는데 쓰이는 고유한 식별명입니다. (예: 체력 -mp, 이성 -san)
              
              옵션1: 식별명만 입력하면 이것을 바탕으로 '현재값'의 변경을 감지합니다.
              만약 '최대값'의 변경을 감지하도록 지정하시려면 식별명 뒤에 _max를 붙이세요.
              (예시: 마기카로기아의 마력 현재값 식별명 -mp, 마력 최대치 식별명 -mp_max)
              
              옵션2: 체력,마력같은 단일한 속성과 달리 장서목록처럼 복수로 생성되는 항목을 추적할 경우
              완전한 식별명 대신 특정 문자열을 지정한 뒤, 이 문자열이 포함된 식별명을 가진 속성은 모두 변화를 감지하도록 지정할 수 있습니다.
              (예: 마기카로기아의 장서 마소 차지상태 -Magic_02_Charge,Magic_03_Charge...
                -> 이 경우 attr에 Magic_*id*_Charge를 입력하면 이러한 문장형식을 가진 속성의 변화를 모두 체크합니다.)
              (이와 관련된 옵션은 아래의 is_static_attr 속성을 참고하세요.)

            - name: 해당 속성을 일컬을 때 실제 사용되는 이름을 지정합니다. 이 값은 로그에 표시됩니다. (예: 체력,이성,행운 등등)
              만약 속성의 이름이 다른 속성에 담겨있는 경우 속성명을 담고 있는 속성의 식별명을 입력해주세요.
              (예: 마기카로기아에서 '기사소환' 장서에 마소를 충전할 경우 차지된 마소량은 Magic_02_Charge에서,
              장서의 이름은 Magic_02_Name로부터 가져오는 식입니다.)

            - is_static_name: 위의 name에서 지정한 이름이 고정된 값인지 아니면 다른 곳에서 불러와야 하는 값인지를 지정합니다.
              true일 경우 name에 지정된 값을 그대로 로그에 출력합니다.
              (예: name에 '체력'을 입력 -> 표시결과: 체력/ 10→9)
              false일 경우 name에 지정된 값을 식별명으로 하는 다른 속성으로부터 이름을 가져옵니다.
              (예: name에 'Magic_02_Name'을 입력 -> Magic_02_Name으로부터 '기사소환'이란 문자열을 가져옴 -> 표시결과: 기사소환/ 0→2)

            - is_static_attr: 위의 attr에서 지정한 식별명이 고정된 값인지 검색키워드로 사용할 문자열인지를 지정합니다.
              true일 경우 attr에 지정된 문자열과 식별명이 완전히 일치하는 속성만 변경만 감지합니다.
              false일 경우 attr에 지정된 문자열이 식별명에 포함되는 모든 속성의 변경을 지정합니다.

             * is_static_name과 is_static_attr이 모두 false일 경우
              인벤토리 아이템이나 스킬목록 같은 복수형 속성이 이런 경우에 해당됩니다.
              이렇게 설정하면 attr에 입력한 내용과 같은 문장형식을 가진 속성의 변화를 모두 감지하고
              그 속성의 식별명에서 가져온 고유변호를 name에 입력한 문장형식에 대입해서 속성명을 가져옵니다.
              (예: 마기카로기아의 경우 attr에 Magic_*id*_Charge를 지정하고 name에는 Magic_*id*_Name을 지정합니다.
              이렇게 함으로서 Magic_02_Charge의 변화를 감지했을 때 이 식별명에서 02라는 번호를 가져오고
              Magic_*id*_Name의 *id*부분에 대입함으로서 최종적으로 Magic_02_Name으로부터 장서명을 가져오게 됩니다.)

            (복잡하죠? 이 이상 간단히 만들 수가 없었습니다. 애매하면 아래의 예시를 어떻게 잘 짜집기 해보세요. 화이팅입니다.)

  	4. [Save Script]로 저장합니다.
  	5. 페이지 아래쪽의 API Output Console에 에러 메시지가 표시되지 않는다면 정상적으로 적용된 것입니다.

  	준비2. 테스트
  	1. 캐릭터의 시트 내 수치를 변경해보고 채팅창에 로그가 출력되는지 확인합니다.
  	2. 기존에 값이 없거나 기본값으로 설정되어 있던 수치는 '변경'으로 인식되지 않아 로그가 출력되지 않을 수 있습니다.

*/
// (attribute_tracker.js) *** 코드 시작 ***
// !! 아래의 예시 check_list 중 사용하실 1개만 남기고 삭제하시거나 사용할 룰에 맞춰 새 체크리스트를 생성하세요.
// CoC 체크리스트
let check_list = [
    {attr: "hp", name: "체력", is_static_name: true, is_static_attr: true},
    {attr: "mp", name: "마력", is_static_name: true, is_static_attr: true},
    {attr: "san", name: "이성", is_static_name: true, is_static_attr: true},
    {attr: "luck", name: "행운", is_static_name: true, is_static_attr: true},
    {attr: "str", name: "근력", is_static_name: true, is_static_attr: true},
    {attr: "dex", name: "민첩", is_static_name: true, is_static_attr: true},
    {attr: "pow", name: "정신", is_static_name: true, is_static_attr: true},
    {attr: "con", name: "건강", is_static_name: true, is_static_attr: true},
    {attr: "app", name: "외모", is_static_name: true, is_static_attr: true},
    {attr: "edu", name: "교육", is_static_name: true, is_static_attr: true},
    {attr: "siz", name: "크기", is_static_name: true, is_static_attr: true},
    {attr: "int", name: "지능", is_static_name: true, is_static_attr: true},
    {attr: "cthulhu_mythos", name: "크툴루 신화", is_static_name: true, is_static_attr: true}];

// 인세인 체크리스트
let check_list = [
    {attr: "hp", name: "생명력", is_static_name: true, is_static_attr: true},
    {attr: "san", name: "이성치", is_static_name: true, is_static_attr: true},
    {attr: "ins_item1", name: "진통제", is_static_name: true, is_static_attr: true},
    {attr: "ins_item2", name: "무기", is_static_name: true, is_static_attr: true},
    {attr: "ins_item3", name: "부적", is_static_name: true, is_static_attr: true}];

// 마기카로기아 체크리스트
let check_list = [
    {attr: "Magic_*id*_Charge", name: "Magic_*id*_Name", is_static_name: false, is_static_attr: false},
    {attr: "repeating_acitems_-*id*_Magic_Charge", name: "repeating_acitems_-*id*_Magic_Name", is_static_name: false, is_static_attr: false},
    {attr: "Magic_*id*_Cost", name: "Magic_*id*_Name", is_static_name: false, is_static_attr: false},
    {attr: "repeating_acitems_-*id*_Magic_Cost", name: "repeating_acitems_-*id*_Magic_Name", is_static_name: false, is_static_attr: false},
    {attr: "relation_fate_*id*", name: "relation_name_*id*", is_static_name: false, is_static_attr: false},
    {attr: "atk", name: "공격력", is_static_name: true, is_static_attr: true},
    {attr: "def", name: "방어력", is_static_name: true, is_static_attr: true},
    {attr: "bas", name: "근원력", is_static_name: true, is_static_attr: true},
    {attr: "mp", name: "마력", is_static_name: true, is_static_attr: true},
    {attr: "temp_mp", name: "일시적 마력", is_static_name: true, is_static_attr: true},
    {attr: "mp_max", name: "최대마력", is_static_name: true, is_static_attr: true}];

// 목록 작성 예시 (대괄호[ ]안에서 따옴표' '로 이름을 감싸서 반점,으로 분리해 기입하세요.)
// let prior_list = ['이름A','캐릭터 이름','character name'];

// 필수적으로 변화를 체크할 캐릭터의 이름을 기입합니다.
// ignore_list에 포함되는 조건을 갖고 있지만 로그에 표시할 필요가 있는 캐릭터가 해당됩니다. (예: GMPC)
let prior_list = [];

// 로그 표시에서 제외할 캐릭터의 이름을 기입합니다.
// 'GM'을 넣으면 GM에게만 조작권한이 있는 모든 캐릭터를 일괄적으로 제외합니다.
let ignore_list = [];
    
on('ready', function() {
    on("add:attribute", function(obj) {
        check_attribute(obj, null);
    });
});
    
on("change:attribute", function(obj, prev) {
    check_attribute(obj, prev);
});

function check_attribute(obj,prev) {
    try {
        var check_pl = false;
        let cha = getObj('character',obj.get('_characterid'));
        if (prior_list.indexOf(cha.get('name')) > -1 || ignore_list.length == 0) {
            check_pl = true;
        } else if (ignore_list.indexOf(cha.get('name')) > -1) {
            check_pl = false;
        } else if (ignore_list.indexOf('GM') > -1) {
            let controller = cha.get('controlledby');
            for (var i=0;i<controller.length;i++) {
                if (!playerIsGM(controller[i])) {
                    check_pl = true;
                    break;
                }
            }
        }
        
        if (check_pl) {
            for (var i=0;i<check_list.length;i++) {
                var check = false;
                var item = check_list[i];
                let item_id = null;
                let check_max = item.attr.includes('_max');
                if (prev == null || check_max && obj.get('current') == prev.current || !check_max && obj.get('current') != prev.current) {
                    if (item.attr.replace('_max','') == obj.get('name')) {
                        check = true;
                    } else if (!item.is_static_attr) {
                        let split_attr = item.attr.split('*id*');
                        if (split_attr.length == 2 && obj.get('name').startsWith(split_attr[0]) && obj.get('name').endsWith(split_attr[1])) {
                            check = true;
                            item_id = obj.get('name').replace(split_attr[0],'').replace(split_attr[1],'');
                        }
                    }
                }
                if (check) {
                    var name = item.name;
                    if (!item.is_static_name) {
                        if (!item.is_static_attr) {
                            name = item.name.replace('*id*',item_id);
                        }
                        var search_name = findObjs({type: "attribute", name: name, characterid: obj.get('_characterid')});
                        if (search_name.length > 0) {
                            name = search_name[0].get('current');
                        } else {
                            sendChat("error","/w gm 이름이 " + name + "인 값이 캐릭터시트에 없습니다.",null,{noarchive:true}); return;
                        }
                    }
                    sendChat("character|"+obj.get('_characterid'),
                        "**" + name + "** / " + (prev == null?"":(check_max? prev.max:prev.current)) + " → " +
                        (check_max ? obj.get('max'):obj.get('current')),null,{noarchive:false});
                    break;
                }
            }
        }
    } catch (err) {
        sendChat("error","/w gm " + err,null,{noarchive:true});
    }
}
// (attribute_tracker.js) *** 코드 종료 ***