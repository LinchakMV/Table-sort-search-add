import React, { PropTypes, Component } from 'react';
import './TableContainer.css';

const BASE_URL = 'https://randomuser.me/api/';

export default class TableContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isError: false,
      currentPage: 1,
      users: [],
      amount: 5,
      currentSearch: '',
      currentSort: {},
      currentUser: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });
    fetch(
      `${BASE_URL}?page=${this.state.currentPage}&results=${this.state.amount}&inc=name,location,email,login&noinfo&seed=abc`,
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject('Error');
      })
      .then(jsonResponse => {
        this.setState({ users: jsonResponse.results, isLoading: false });
      })
      .catch(error => {
        this.setState({ isError: true, isLoading: false });
      });
  };

  onPrev = () => {
    if (this.state.currentPage > 1) {
      this.setState(
        {
          currentPage: this.state.currentPage - 1,
        },
        this.fetchData,
      );
    }
  };

  onNext = () => {
    this.setState(
      {
        currentPage: this.state.currentPage + 1,
      },
      this.fetchData,
    );
  };

  onSearch = event => {
    this.setState({ currentSearch: event.target.value });
  };

  onSort(type) {
    const sortType = {};
    
    if (this.state.currentSort.type !== type) {
      sortType.value = false;      
    }

    sortType.type = type;
    sortType.value = !this.state.currentSort.value;

    console.log(sortType);

    this.setState({ currentSort: sortType });
  }

  onUserSelect(user){
    this.setState({ currentUser: user });
    console.log(user);
  }

  onAmount = event => {
    const amount = parseInt(event.target.value, 10);
    this.setState({ amount: amount }, this.fetchData);
  };

  render() {
    if (this.state.isError) {
      return <div>Error during fetching </div>;
    }

    const toSearch = this.state.currentSearch.toLowerCase();

    const filteredData = this.state.users.filter(item => {
      const name = (item.name.first + ' ' + item.name.last).toLowerCase();
      const city = item.location.city.toLowerCase();
      const nickName = item.login.username.toLowerCase();
      const email = item.email.toLowerCase();

      const isNameMatched = name.indexOf(toSearch) !== -1;
      const isCityMatched = city.indexOf(toSearch) !== -1;
      const isNickNameMatched = nickName.indexOf(toSearch) !== -1;
      const isEmailMatched = email.indexOf(toSearch) !== -1;

      return isNameMatched ||
        isCityMatched ||
        isNickNameMatched ||
        isEmailMatched;
    });

    let sorted = filteredData.sort((a, b) => {
      switch (this.state.currentSort.type) {
        case 'fullname':
          const aName = (a.name.first + ' ' + a.name.last).toLowerCase();
          const bName = (b.name.first + ' ' + b.name.last).toLowerCase();
          return aName.localeCompare(bName);
        case 'city':
          const aCity = a.location.city.toLowerCase();
          const bCity = b.location.city.toLowerCase();
          return aCity.localeCompare(bCity);
        case 'nickname':
          const aNick = a.login.username.toLowerCase();
          const bNick = b.login.username.toLowerCase();
          return aNick.localeCompare(bNick);
        case 'email':
          const aEmail = a.email.toLowerCase();
          const bEmail = b.email.toLowerCase();
          return  aEmail.localeCompare(bEmail);
      }
    });

    if (this.state.currentSort.value) {
      sorted = sorted.reverse();
    }

    return (
      <div>
        <div>
          <span>Choose number of lines per page:</span>

          <input
            type="radio"
            value="25"
            checked={this.state.amount === 25}
            onChange={this.onAmount}
          />
          25
          <input
            type="radio"
            value="75"
            checked={this.state.amount === 75}
            onChange={this.onAmount}
          />
          75
          <input
            type="radio"
            value="5"
            checked={this.state.amount === 5}
            onChange={this.onAmount}
          />
          5
        </div>

        <input className="search" type="search" placeholder="Filter by" onChange={this.onSearch} />
        {this.state.currentPage !== 1 &&
          <button onClick={this.onPrev}>prev</button>}
        <button onClick={this.onNext}>next</button>

        {!this.state.isLoading
          ? <table>
              <thead>
                <tr>
                  <th onClick={this.onSort.bind(this, 'fullname')}>
                    Full name
                  </th>
                  <th onClick={this.onSort.bind(this, 'city')}>City</th>
                  <th onClick={this.onSort.bind(this, 'nickname')}>Nickname</th>
                  <th onClick={this.onSort.bind(this, 'email')}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(user => {
                  return (
                    <tr key={user.email} onClick={this.onUserSelect.bind(this, user)}>
                      <td className="fullName">{user.name.first + ' ' + user.name.last}</td>
                      <td className="city">{user.location.city}</td>
                      <td>{user.login.username}</td>
                      <td>{user.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>            
          : <div>Is loading..</div>}
        
        {this.state.currentUser ? <div className="selected"><span>{this.state.currentUser.name.first+' '+this.state.currentUser.name.last+' '+this.state.currentUser.location.city}</span>{' '+this.state.currentUser.login.username+' '+this.state.currentUser.email}</div> : null}
      </div>
    );
  }
}
