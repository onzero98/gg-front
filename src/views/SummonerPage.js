import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";
import "./SummonerPage.css";

import UNRANKED from '../img/ranked-emblems/Unranked.png';
import IRON from '../img/ranked-emblems/Iron.png';
import BRONZE from '../img/ranked-emblems/Bronze.png';
import SILVER from '../img/ranked-emblems/Silver.png';
import GOLD from '../img/ranked-emblems/Gold.png';
import PLATINUM from '../img/ranked-emblems/Platinum.png';
import DIAMOND from '../img/ranked-emblems/Diamond.png';
import MASTER from '../img/ranked-emblems/Master.png';
import GRANDMASTER from '../img/ranked-emblems/Grandmaster.png';
import CHALLENGER from '../img/ranked-emblems/Challenger.png';

import { champKr, mapName, champIcon, itemIcon, durationTime, summonerSpellIcon, killDeathAssist, grade, winOrLose} from "../utils/ParseData";

const SummonerPage = () => {
	const [searchParams] = useSearchParams();
	const [summoner, setSummoner] = useState({ name: " ", summonerId: "", summonerLevel: " ", profileIconId: " ", puuid: " " });
	const [soloTierIconPath, setSoloTierIconPath] = useState("");
	const [flexTierIconPath, setFlexTierIconPath] = useState("");
	const [isClicked, setIsClicked] = useState({ isClickTrue: " " }); // 임시 버튼 클릭시 렌더 되게.
	const [list, setList] = useState([]);
	const [toJson, setToJson] = useState([]);

	const username = searchParams.get('userName');
	const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/12.1.1/img/profileicon/${summoner.profileIconId}.png`

	const HOST = "http://localhost:8080";

	function callTierImage(Tier) {

		const soloTier = Tier.solo.tier
		const flexTier = Tier.flex.tier

		if (soloTier === "") {
			setSoloTierIconPath(UNRANKED);
		}
		if (soloTier === "IRON") {
			setSoloTierIconPath(IRON);
		}
		if (soloTier === "BRONZE") {
			setSoloTierIconPath(BRONZE);
		}
		if (soloTier === "SILVER") {
			setSoloTierIconPath(SILVER);
		}
		if (soloTier === "GOLD") {
			setSoloTierIconPath(GOLD);
		}
		if (soloTier === "PLATINUM") {
			setSoloTierIconPath(PLATINUM);
		}
		if (soloTier === "DIAMOND") {
			setSoloTierIconPath(DIAMOND);
		}
		if (soloTier === "MASTER") {
			setSoloTierIconPath(MASTER);
		}
		if (soloTier === "GRANDMASTER") {
			setSoloTierIconPath(GRANDMASTER);
		}
		if (soloTier === "CHALLENGER") {
			setSoloTierIconPath(CHALLENGER);
		}
		// ========================================== //
		if (flexTier === "") {
			setFlexTierIconPath(UNRANKED);
		}
		if (flexTier === "IRON") {
			setFlexTierIconPath(IRON);
		}
		if (flexTier === "BRONZE") {
			setFlexTierIconPath(BRONZE);
		}
		if (flexTier === "SILVER") {
			setFlexTierIconPath(SILVER);
		}
		if (flexTier === "GOLD") {
			setFlexTierIconPath(GOLD);
		}
		if (flexTier === "PLATINUM") {
			setFlexTierIconPath(PLATINUM);
		}
		if (flexTier === "DIAMOND") {
			setFlexTierIconPath(DIAMOND);
		}
		if (flexTier === "MASTER") {
			setFlexTierIconPath(MASTER);
		}
		if (flexTier === "GRANDMASTER") {
			setFlexTierIconPath(GRANDMASTER);
		}
		if (flexTier === "CHALLENGER") {
			setFlexTierIconPath(CHALLENGER);
		}
	}

	// 검색된 사용자의 프로필 정보를 summoner 에 저장
	useLayoutEffect(() => {
		async function refresh() {
			const { data } = await Promise.resolve(getProfile(username));
			setSummoner({ name: data.name, summonerId: data.summonerId, summonerLevel: data.summonerLevel, profileIconId: data.profileIconId, puuid: data.puuid });
		}
		refresh();
	}, [username]); // 빈 배열 객체 두번째 인자로 줘서 useEffect를 무한루프 시키는 것을 방지

	// 검색된 사용자의 티어 정보를 표시
	useEffect(() => {
		async function setTier() {
			const { data } = await Promise.resolve(getSummonerTier(summoner.summonerId));
			callTierImage(data)
		}
		setTier();
	}, [summoner.summonerId]);

	// 검색된 사용자의 전적을 리스트에 미리 저장
	useLayoutEffect(() => {
		async function ShowGameHistory() {
			const matchIdsArray = await getMatchHistory(summoner.puuid);
			const games = matchIdsArray.data;
			var gamedata = { gameDuration: " ", mapId: " ", player1: " ", player2: " ", player3: " ", player4: " ", player5: " ", player6: " ", player7: " ", player8: " ", player9: " ", player10: " ", };
			var resultArray = [];
			games.forEach(async element => {
				const {data} = await getMatchDetail(element);

				gamedata.gameDuration = data.gameDuration
				gamedata.mapId = data.mapId

				for (var i = 0; i < 10; i++) {
					var mine = {};
					if (summoner.summonerId === data.participants[i].summonerId) {
						mine.gameDuration = data.gameDuration
						mine.mapId = data.mapId
						mine.kills = data.participants[i].kills
						mine.deaths = data.participants[i].deaths
						mine.assists = data.participants[i].assists
						mine.win = data.participants[i].win + " "
						mine.championName = data.participants[i].championName
						mine.summonerName = data.participants[i].summonerName
						mine.item0 = data.participants[i].item0
						mine.item1 = data.participants[i].item1
						mine.item2 = data.participants[i].item2
						mine.item3 = data.participants[i].item3
						mine.item4 = data.participants[i].item4
						mine.item5 = data.participants[i].item5
						mine.item6 = data.participants[i].item6
						mine.totalMinionsKilled = data.participants[i].totalMinionsKilled
						mine.summoner1Id = data.participants[i].summoner1Id
						mine.summoner2Id = data.participants[i].summoner2Id

						resultArray.push(mine)
						console.log(resultArray)
					}
				}
			});
			setList(resultArray)
		}
		ShowGameHistory();
	}, [summoner.puuid, summoner.summonerId])

	const getProfile = async (username) => {
		return await axios.get(HOST + `/api/v1/userdata/${unescape(username)}`);
	};

	const getSummonerTier = async (summonerId) => {
		return await axios.get(HOST + `/api/v1/tier/${summonerId}`);
	}

	const getMatchHistory = async (puuid) => {
		return await axios.get(HOST + `/api/v1/history/${puuid}`);
	}

	const getMatchDetail = async (matchId) => {
		return await axios.get(HOST + `/api/v1/match/${matchId}`);
	}

	// 버튼을 눌렀을 떄 전적 갱신되게 만들기
	const onClick = async () => {
		// toJson = JSON.stringify(list)
		setToJson(JSON.stringify(list))    
		if(toJson.length > 0 && toJson !== null){
		  setIsClicked({ isClickTrue: "true" });
		  }
	}

	function isWin(win){
		if("true "===win){
			return true;
		}
		else{
			return false;
		}
}

	// render 하는 중 NotValid(div)가 먼저 로드 되서 해당 텍스트가 보이는 것을 방지 하기 위한 load 체크용
	const isLoading = soloTierIconPath == null;

	return (
		<Container>
			<HeaderBox>
				{
					summoner.name !== " "
						?
						<SummonerInfo>
							<SummonerIcon src={profileIconUrl} />
							<SummonerName>{summoner.name}
								<RenewButton onClick={onClick}>전적 갱신</RenewButton>
							</SummonerName>
							<SummonerLevel>{summoner.summonerLevel}</SummonerLevel>
							{/* 티어 표시 */}
							<WhichRank>
								<SummonerTierIconImg src={soloTierIconPath} />솔로랭크
							</WhichRank>
							{/* <Tier></Tier> */}

							<WhichRank>
								<SummonerTierIconImg src={flexTierIconPath} />자유 5:5 랭크
							</WhichRank>
							{/* <Tier>{flexUserData.flex.tier}{flexUserData.flex.rank}</Tier> */}
						</SummonerInfo>
						: (
							summoner.name !== " " && isLoading !== null
								?
								<SummonerInfo>
									<NotValid>해당하는 소환사명을 가진 사용자는 존재하지 않습니다. 오타를 확인 후 다시 검색 해주세요.</NotValid>
								</SummonerInfo>
								: null
						)
				}
			</HeaderBox>
			<UserMatchHistory>
                {
                    isClicked.isClickTrue !== " "
                        ? <ShowGame>
                            {JSON.parse(toJson).map((data) => (
                                    
                                    (isWin(data.win) === true) ? (
                                        <div className="matchStatusTable-Wrapper">
                                            <table className="matchStatusTable-win">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <tr>
                                                                <td id="summonerName">{data.summonerName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="win">승리</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td id="map">{mapName(data.mapId)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="gameTime">{durationTime(data.gameDuration)}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td><ChampIcon src = {champIcon(data.championName)}></ChampIcon></td>
                                                                
                                                                <tr>
                                                                    <td><SummonerSpellIcon src={summonerSpellIcon(data.summoner1Id)}/></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><SummonerSpellIcon src={summonerSpellIcon(data.summoner2Id)}/></td>
                                                                </tr>

                                                            </tr>
                                                            <tr>
                                                                <td id="championName">{champKr(data.championName)}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td id="status">{killDeathAssist(data.kills, data.deaths, data.assists)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="grade">{grade(data.kills, data.deaths, data.assists)}평점</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="CS">CS:{data.totalMinionsKilled}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item0)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item1)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item2)}/></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item3)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item4)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item5)}/></div>
                                                                </td>
                                                            </tr>
                                                        </td>
                                                        
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>)
                                        :
                                        (<div className="matchStatusTable-Wrapper">
                                            
                                            <table className="matchStatusTable-lose">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <tr>
                                                                <td id="summonerName">{data.summonerName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="lose">패배</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td id="map">{mapName(data.mapId)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="gameTime">{durationTime(data.gameDuration)}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td><ChampIcon src = {champIcon(data.championName)}></ChampIcon></td>
                                                                
                                                                <tr>
                                                                    <td><SummonerSpellIcon src={summonerSpellIcon(data.summoner1Id)}/></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><SummonerSpellIcon src={summonerSpellIcon(data.summoner2Id)}/></td>
                                                                </tr>

                                                            </tr>
                                                            <tr>
                                                                <td id="championName">{champKr(data.championName)}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td id="status">{killDeathAssist(data.kills, data.deaths, data.assists)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="grade">{grade(data.kills, data.deaths, data.assists)}평점</td>
                                                            </tr>
                                                            <tr>
                                                                <td id="CS">CS:{data.totalMinionsKilled}</td>
                                                            </tr>
                                                        </td>
                                                        <td>
                                                            <tr>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item0)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item1)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item2)}/></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item3)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item4)}/></div>
                                                                </td>
                                                                <td>
                                                                    <div id="itemIcon"><ItemIcon src = {itemIcon(data.item5)}/></div>
                                                                </td>
                                                            </tr>
                                                        </td>
                                                        
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        )
                            ))}
                        </ShowGame>
                        : <ShowGameNull>

                        </ShowGameNull>
                }
            </UserMatchHistory>
		</Container>
	)
}

export default SummonerPage;

const RenewButton = styled.button`
margin-top: 50px;
margin-left: 40px;
display: flex;
align-items: center;
justify-content: center;
height: 50px;
width: 100px;
border: none;
border-radius: 10%;
color: white;
background-color: #7c47e9;
cursor: pointer;
transition: 0.2s ease-in-out;
  &:hover {
    background-color: #673bc1;
  }
`

const ShowGame = styled.div`
color: white;
`

const ShowGameNull = styled.div`
height: 50vh;
`

const Container = styled.div`
background: #1c1c1f;
`

const NotValid = styled.div`
color: white;
font-size: 30px;
`

const SummonerName = styled.h1`
height: 100px;
margin-left: 10px;
margin-top: 40px;
/* display: flex; */
align-items: flex-start;
font-size: 40px;
color:white;
cursor: default;
`

const SummonerLevel = styled.div`
height: 15%;
margin-left: 10px;
display: flex;
background: #eabd56;
padding: 5px;
margin-top: 45px;
color: white;
border-radius: 25% 10%;
font-size: 30px;
font-family: 'Do Hyeon', sans-serif;
cursor: default;
`

const SummonerIcon = styled.img`
height: 70%;
border-radius: 10%;
margin-top: 35px;
`

const SummonerTierIcon = styled.div`

`


const SummonerTierIconImg = styled.img`
display: flex;
height: 80%;
margin-top: 5px;
margin-bottom: 5px;

`

const WhichRank = styled.div`
margin-left: 100px;
font-family: 'Do Hyeon', sans-serif;
font-size: 25px;
color: #676663;
justify-content: center;
align-items: center;
text-align: center;
`

const SummonerInfo = styled.div`
height: 240px;
display: flex;
justify-content: center;
margin-left: 200px;
margin-right: 200px;
overflow: hidden;

`

const HeaderBox = styled.div`
height: 240px;
width: 100%;
background: #31313c;
-ms-user-select: none; 
-moz-user-select: -moz-none;
-khtml-user-select: none;
-webkit-user-select: none;
user-select: none;
`

const UserMatchHistory = styled.div`

`
const ChampIcon = styled.img`
height: 80px;
`
const SummonerSpellIcon = styled.img`
height: 40px;
`

const ItemIcon = styled.img`
max-width: 100%;
max-height: 100%;
`
