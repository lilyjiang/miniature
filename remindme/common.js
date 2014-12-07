var RemindMeBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadRemindMesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadRemindMesFromServer();
    //setInterval(this.loadRemindMesFromServer, this.props.pollInterval);
  },
  handleRemindMeSubmit: function(remindme) {
    var remindmes = this.state.data;
    var newRemindmes = remindmes.concat([remindme]);
    this.setState({data: newRemindmes});
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   type: 'POST',
    //   data: remindme,
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
  },
  render: function() {
    return (
      <div className="RemindMeBox">
        <RemindMeList data={this.state.data} />
        <RemindMeForm onRemindMeSubmit={this.handleRemindMeSubmit} />
      </div>
    );
  }
});

var RemindMeList = React.createClass({
	render: function(){
		var remindmeNodes = this.props.data.map(function(remindme){
			return (
				<RemindMe date={remindme.date}>
					{remindme.content}
				</RemindMe>
			);
		});
		return (
			<div className="RemindMeList">
				{remindmeNodes}
			</div>
		);
	}
});

var RemindMeForm = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		var content = this.refs.content.getDOMNode().value.trim();
		var date = this.refs.date.getDOMNode().value.trim();

		if(!content || !date){
			return;
		}

		this.props.onRemindMeSubmit({content: content, date: date});
	    this.refs.content.getDOMNode().value = '';
	    this.refs.date.getDOMNode().value = '';
	    return;

	},
	render: function(){
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
		        <input type="text" placeholder="Your content" ref="content" />
		        <input type="text" placeholder="Date..." ref="date" />
            <select>
              <option value="once">一次性事件</option>
              <option value="cycle">循环</option>
            </select>
            <select>
              <option value="0">选择周期</option>
              <option value="2">1周</option>
              <option value="3">1个月</option>
              <option value="4">6个月</option>
              <option value="5">1年</option>
              <option value="6">2年</option>
              <option value="7">3年</option>
            </select>
		        <input type="submit" value="确定" />
		    </form>
		);
	}
});

var RemindMe = React.createClass({
	render: function(){
		return (
			<div className="remindme">
				<h2 className="remindmeContent">{this.props.children}</h2>
				<span className="remindmeDate">{this.props.date}</span>
			</div>
		);
	}
});

React.render(
  <RemindMeBox url="remindme.json" pollInterval={2000} />,
  document.getElementById('content')
);
